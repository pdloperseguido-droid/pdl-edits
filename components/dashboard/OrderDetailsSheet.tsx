import { X, Calendar, DollarSign, MessageCircle, FileText, Download, Clock, CheckCircle2, PlayCircle, Search, AlertCircle } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { OrderStatus } from '@/lib/db/schema';
import Link from 'next/link';
import { LinkifiedText } from '@/components/ui/LinkifiedText';

interface OrderDetailsSheetProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsSheet({ order, isOpen, onClose }: OrderDetailsSheetProps) {
  if (!order) return null;

  const status = order.status as OrderStatus;

  const timeline = [
    { label: 'Pedido Criado', date: order.createdAt, icon: Clock, completed: true },
    { label: 'Pagamento Confirmado', date: order.updatedAt, icon: DollarSign, completed: ['CONFIRMED', 'IN_PROGRESS', 'REVIEW', 'DELIVERED'].includes(status) },
    { label: 'Em Edição', date: null, icon: PlayCircle, completed: ['IN_PROGRESS', 'REVIEW', 'DELIVERED'].includes(status) },
    { label: 'Revisão', date: null, icon: Search, completed: ['REVIEW', 'DELIVERED'].includes(status) },
    { label: 'Entregue', date: null, icon: CheckCircle2, completed: status === 'DELIVERED' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] border-l border-white/5 z-[101] transition-transform duration-500 ease-out shadow-2xl overflow-y-auto custom-scrollbar",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Detalhes do Pedido</h2>
              <OrderStatusBadge status={status} />
            </div>
            <p className="text-xs text-zinc-500 font-mono">#{order.id.toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Service Info */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 flex-shrink-0">
               {order.service?.thumbnailUrl ? (
                <img src={order.service.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <FileText className="w-8 h-8 text-violet-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{order.service?.title ?? 'Serviço'}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>Pedido em {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300 font-bold">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{formatPrice(Number(order.totalPrice))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Status do Processo</h4>
            <div className="relative space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/5" />
              
              {timeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center z-10 border transition-colors duration-500",
                      step.completed ? "bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/20" : "bg-zinc-900 border-white/5 text-zinc-700"
                    )}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-bold transition-colors duration-500",
                        step.completed ? "text-white" : "text-zinc-600"
                      )}>{step.label}</p>
                      {step.date && (
                        <p className="text-[10px] text-zinc-500 mt-0.5">{formatDate(step.date)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          {order.notes && (
            <div>
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Observações</h4>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <LinkifiedText 
                  text={order.notes} 
                  className="text-sm text-zinc-400 leading-relaxed italic block" 
                />
              </div>
            </div>
          )}

          {/* Entrega */}
          {order.deliverableUrl && (
            <div>
              <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Arquivos de Entrega</h4>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Download className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Versão Final</p>
                    <p className="text-[10px] text-emerald-500/60 uppercase">Disponível para download</p>
                  </div>
                </div>
                <a 
                  href={order.deliverableUrl} 
                  target="_blank" 
                  className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Baixar
                </a>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 grid grid-cols-2 gap-4">
            <Link 
              href={`/minha-conta/pedido/${order.id}/chat`}
              className="flex items-center justify-center gap-2 py-4 px-6 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/20 active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat
            </Link>
            <button 
              className="flex items-center justify-center gap-2 py-4 px-6 bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-bold rounded-2xl border border-white/5 transition-all active:scale-[0.98]"
            >
              Ajuda
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
