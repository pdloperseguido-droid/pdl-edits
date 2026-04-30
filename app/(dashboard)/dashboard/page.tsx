import type { Metadata } from 'next';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { orders, users, messages, services } from '@/lib/db/schema';
import { eq, count, sql, desc } from 'drizzle-orm';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import { ShoppingBag, Clock, DollarSign, MessageSquare, ArrowRight, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Dashboard Admin — PDL Edits' };

export default async function DashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/minha-conta');

  const [
    totalOrders,
    pendingOrders,
    recentOrders,
    unreadMessages,
  ] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db.select({ count: count() }).from(orders).where(eq(orders.status, 'PENDING')),
    db
      .select({
        id: orders.id,
        status: orders.status,
        totalPrice: orders.totalPrice,
        createdAt: orders.createdAt,
        user: { name: users.name, email: users.email },
        service: { title: services.title },
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(services, eq(orders.serviceId, services.id))
      .orderBy(desc(orders.createdAt))
      .limit(5),
    db.select({ count: count() }).from(messages).where(eq(messages.isRead, false)),
  ]);

  const revenue = await db
    .select({ total: sql<string>`SUM(total_price)` })
    .from(orders)
    .where(eq(orders.paymentStatus, 'PAID'));

  const stats = [
    { label: 'Receita', value: formatPrice(Number(revenue[0]?.total ?? 0)), icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Pedidos', value: totalOrders[0]?.count ?? 0, icon: ShoppingBag, color: 'text-violet-400' },
    { label: 'Pendentes', value: pendingOrders[0]?.count ?? 0, icon: Clock, color: 'text-amber-400' },
    { label: 'Mensagens', value: unreadMessages[0]?.count ?? 0, icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner Compacto */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-violet-600/10 via-transparent to-transparent border border-white/5 p-6 lg:p-8">
        <div className="relative z-10">
          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 mb-3 font-bold tracking-widest uppercase text-[9px] px-3 py-1 rounded-full">
            Visão Geral
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display tracking-tight mb-2">
            Olá, <span className="text-gradient font-black">{session.user.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-zinc-500 text-sm max-w-sm">
            Você tem <span className="text-zinc-300 font-bold">{pendingOrders[0]?.count} pedidos pendentes</span> aguardando ação.
          </p>
        </div>
      </div>

      {/* Stats Grid Compacto */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-white font-display">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table Section Compacta */}
        <div className="xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-[1.5rem] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-bold text-white font-display">Atividade Recente</h2>
            <Link href="/dashboard/pedidos" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Ver todos →
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.01]">
                  <th className="px-6 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3.5">
                      <Link href={`/dashboard/pedidos/${order.id}/chat`} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                          {order.user?.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-100 font-display leading-tight group-hover:text-violet-400 transition-colors">{order.user?.name}</p>
                          <p className="text-[9px] text-zinc-600 truncate">{order.user?.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="status" status={order.status} className="text-[9px] py-0.5" />
                    </td>
                    <td className="px-6 py-3.5 text-right font-bold text-white font-display text-xs">
                      {formatPrice(Number(order.totalPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column Compacto */}
        <div className="space-y-4">
           <div className="bg-[#0D0D0D] border border-white/5 rounded-[1.5rem] p-5 h-full">
                <div className="flex items-center gap-3 mb-4">
                   <TrendingUp className="w-4 h-4 text-violet-400" />
                   <h3 className="text-sm font-bold text-white font-display">Meta Mensal</h3>
                </div>
                <div className="space-y-4">
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[68%] bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                   </div>
                   <p className="text-[11px] text-zinc-500 leading-snug">
                      Faltam <span className="text-white font-bold">R$ 1.250</span> para bater sua meta.
                   </p>
                   <button className="w-full py-2.5 rounded-xl bg-white text-black font-black text-[9px] uppercase tracking-widest hover:bg-zinc-200 transition-all">
                      Relatório
                   </button>
                </div>
           </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <Users className="w-4 h-4 text-blue-400" />
                 <h3 className="text-sm font-bold text-white font-display">Equipe</h3>
              </div>
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full bg-zinc-800 border border-[#0D0D0D] flex items-center justify-center text-[9px] font-bold text-zinc-500">JD</div>
                 ))}
              </div>
              <p className="text-[10px] text-zinc-600">2 editores ativos gerenciando projetos.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Film({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M17 3v18"/><path d="M3 7h4"/><path d="M3 12h18"/><path d="M3 17h4"/><path d="M17 17h4"/><path d="M17 7h4"/></svg>
  )
}
