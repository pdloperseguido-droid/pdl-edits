import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, CreditCard } from 'lucide-react';
import { auth } from '@/lib/auth/config';
import { getOrderById } from '@/server/actions/orders';
import { getMessages } from '@/server/actions/messages';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { OrderStatusBadge } from '@/components/chat/OrderStatusBadge';
import { formatPrice, formatDate } from '@/lib/utils';
import type { OrderStatus } from '@/lib/db/schema';

export const metadata: Metadata = { title: 'Chat do Pedido' };

export default async function ClientChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) notFound();

  const [order, messages] = await Promise.all([
    getOrderById(id),
    getMessages(id),
  ]);

  if (!order) notFound();

  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#0D0D0D] flex-shrink-0">
        <Link href="/minha-conta" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{order.service?.title}</h1>
          <p className="text-sm text-zinc-500">#{id.slice(0, 8).toUpperCase()}</p>
        </div>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>

      {/* Layout: sidebar info + chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-white/5 bg-[#0D0D0D] overflow-y-auto flex-shrink-0 p-5 space-y-6 hidden md:block">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Seu Pedido</p>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <Package className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Serviço</p>
                  <p className="text-sm font-medium text-white">{order.service?.title}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Valor pago</p>
                  <p className="text-sm font-medium text-white">{formatPrice(Number(order.totalPrice))}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500">Data</p>
                  <p className="text-sm font-medium text-white">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Suas notas</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{order.notes}</p>
            </div>
          )}

          {order.deliverableUrl && (
            <div className="glass border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Projeto Entregue!
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">Acesse e assista ao seu vídeo finalizado no link abaixo:</p>
              </div>
              <a 
                href={order.deliverableUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-2.5 bg-black/40 border border-white/5 rounded-lg group hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
              >
                <span className="text-[10px] font-medium text-white truncate max-w-[100px]">{order.deliverableUrl}</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 flex-shrink-0">
                  Acessar <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            </div>
          )}

          <div className="glass border border-violet-500/15 rounded-xl p-4">
            <p className="text-xs text-violet-300 font-medium mb-1">💡 Dica</p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Envie referências, ideias e arquivos pelo chat. Seu editor responderá em breve!
            </p>
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
