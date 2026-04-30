import type { Metadata } from 'next';
import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, Package, Clock, ChevronRight } from 'lucide-react';
import { getOrders } from '@/server/actions/orders';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Minha Conta' };

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if (session.user.role === 'ADMIN') redirect('/dashboard');

  const orders = await getOrders();

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white">
          Olá, <span className="text-gradient">{session.user.name.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-zinc-400 mt-1">Acompanhe seus pedidos e converse com o editor.</p>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass border border-white/5 rounded-2xl p-5">
          <Package className="w-8 h-8 text-violet-400 mb-3" />
          <p className="text-2xl font-black text-white">{orders.length}</p>
          <p className="text-sm text-zinc-500">Total de pedidos</p>
        </div>
        <div className="glass border border-white/5 rounded-2xl p-5">
          <Clock className="w-8 h-8 text-amber-400 mb-3" />
          <p className="text-2xl font-black text-white">
            {orders.filter((o) => !['DELIVERED', 'CANCELLED'].includes(o.status)).length}
          </p>
          <p className="text-sm text-zinc-500">Em andamento</p>
        </div>
        <div className="glass border border-white/5 rounded-2xl p-5">
          <MessageSquare className="w-8 h-8 text-emerald-400 mb-3" />
          <p className="text-2xl font-black text-white">
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </p>
          <p className="text-sm text-zinc-500">Entregues</p>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="glass border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="font-bold text-white">Meus Pedidos</h2>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">Nenhum pedido ainda</p>
            <p className="text-zinc-600 text-sm mt-1 mb-6">Explore nosso catálogo e faça seu primeiro pedido!</p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 btn-gradient text-white text-sm font-semibold px-6 py-3 rounded-xl"
            >
              Ver Serviços
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/minha-conta/pedido/${order.id}/chat`}
                className="flex items-center gap-4 px-6 py-5 hover:bg-white/2 transition-colors group"
              >
                {/* Thumb */}
                <div className="w-12 h-12 rounded-xl bg-violet-900/40 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-violet-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">
                    {order.service?.title ?? 'Serviço'}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Pedido em {formatDate(order.createdAt)} · #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>

                {/* Status + valor */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge variant="status" status={order.status} size="sm" />
                  <p className="text-sm font-semibold text-zinc-300">
                    {formatPrice(Number(order.totalPrice))}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors ml-1 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
