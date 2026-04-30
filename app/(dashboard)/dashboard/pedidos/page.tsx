import type { Metadata } from 'next';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { orders, users, services, messages } from '@/lib/db/schema';
import { eq, desc, and, count, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate, formatRelativeTime } from '@/lib/utils';
import { MessageSquare, Filter } from 'lucide-react';

export const metadata: Metadata = { title: 'Pedidos — Dashboard' };

export default async function PedidosPage() {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/minha-conta');

  const ordersResult = await db
    .select({
      id: orders.id,
      status: orders.status,
      totalPrice: orders.totalPrice,
      createdAt: orders.createdAt,
      userId: orders.userId,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
      service: {
        title: services.title,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(services, eq(orders.serviceId, services.id))
    .orderBy(desc(orders.createdAt));

  // Busca msgs não lidas para os pedidos encontrados
  const unreadCounts = await db
    .select({
      orderId: messages.orderId,
      count: count(),
    })
    .from(messages)
    .where(and(eq(messages.isRead, false), sql`${messages.senderId} != ${session.user.id}`))
    .groupBy(messages.orderId);

  const allOrders = ordersResult.map((order) => ({
    ...order,
    unreadCount: unreadCounts.find((c) => c.orderId === order.id)?.count ?? 0,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Pedidos</h1>
          <p className="text-zinc-400 mt-1">{allOrders.length} pedidos no total</p>
        </div>
      </div>

      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Cliente', 'Serviço', 'Status', 'Valor', 'Data', 'Msgs', 'Ação'].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-zinc-500">
                    Nenhum pedido ainda.
                  </td>
                </tr>
              )}
              {allOrders.map((order) => {
                const unread = order.unreadCount;
                return (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{order.user?.name}</p>
                      <p className="text-xs text-zinc-500">{order.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-300">{order.service?.title}</td>
                    <td className="px-5 py-4">
                      <Badge variant="status" status={order.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 font-medium text-white">
                      {formatPrice(Number(order.totalPrice))}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">
                      {formatRelativeTime(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative inline-flex">
                        <MessageSquare className="w-4 h-4 text-zinc-500" />
                        {unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-violet-500 text-[8px] text-white font-bold flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/pedidos/${order.id}/chat`}
                        className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
                      >
                        Abrir →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
