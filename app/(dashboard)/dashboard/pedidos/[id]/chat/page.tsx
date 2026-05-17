import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react';
import { auth } from '@/lib/auth/config';
import { getOrderById } from '@/server/actions/orders';
import { getMessages } from '@/server/actions/messages';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { LinkifiedText } from '@/components/ui/LinkifiedText';
import { OrderStatusBadge } from '@/components/chat/OrderStatusBadge';
import { DeliverForm } from '@/components/chat/DeliverForm';
import { formatPrice, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/lib/db/schema';

export const metadata: Metadata = { title: 'Chat do Pedido' };

export default async function AdminChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') notFound();

  const [order, messages] = await Promise.all([
    getOrderById(id),
    getMessages(id),
  ]);

  if (!order) notFound();

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0D0D0D] flex-shrink-0">
        <Link href="/dashboard/pedidos" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">{order.service?.title}</h1>
          <p className="text-sm text-zinc-500">
            Cliente: {order.user?.name} · #{id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>

      {/* Área principal: sidebar info + chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de info do pedido */}
        <aside className="w-64 border-r border-white/5 bg-[#0D0D0D] overflow-y-auto flex-shrink-0 p-5 space-y-6">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Detalhes do Pedido</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Serviço</p>
                  <p className="text-sm font-medium text-white">{order.service?.title}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Valor</p>
                  <p className="text-sm font-medium text-white">{formatPrice(Number(order.totalPrice))}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Data do pedido</p>
                  <p className="text-sm font-medium text-white">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          <DeliverForm orderId={id} initialDeliverableUrl={order.deliverableUrl} />

          {order.notes && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Observações</p>
              <LinkifiedText 
                text={order.notes} 
                className="text-sm text-zinc-300 leading-relaxed block" 
              />
            </div>
          )}

          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Cliente</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-900 flex items-center justify-center text-sm font-bold text-violet-300">
                {order.user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{order.user?.name}</p>
                <p className="text-xs text-zinc-500">{order.user?.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            orderId={id}
            currentUserId={session.user.id}
            currentUserRole={session.user.role}
            initialMessages={messages as Parameters<typeof ChatInterface>[0]['initialMessages']}
            orderStatus={order.status as OrderStatus}
          />
        </div>
      </div>
    </div>
  );
}
