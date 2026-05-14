import Link from 'next/link';
import { Package, Calendar, DollarSign, ChevronRight, MessageCircle, Download, Upload } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { OrderStatus } from '@/lib/db/schema';

interface OrderCardProps {
  order: any; // Using any for brevity in this mock-heavy stage, should be properly typed
  onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const status = order.status as OrderStatus;
  
  // Progress calculation based on status
  const getProgress = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 15;
      case 'CONFIRMED': return 35;
      case 'IN_PROGRESS': return 60;
      case 'REVIEW': return 85;
      case 'DELIVERED': return 100;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  };

  const progress = getProgress(status);

  return (
    <div 
      className="group relative glass border border-white/5 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-violet-500/10"
      onClick={onClick}
    >
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Service Info & Thumbnail */}
          <div className="lg:col-span-5 flex items-center gap-6">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-700">
              {order.service?.thumbnailUrl ? (
                <img src={order.service.thumbnailUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                  <Package className="w-8 h-8 text-violet-400/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl md:text-2xl font-black text-white truncate group-hover:text-violet-400 transition-colors">
                  {order.service?.title ?? 'Serviço Personalizado'}
                </h4>
                <OrderStatusBadge status={status} />
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                <span className="flex items-center gap-1.5 uppercase tracking-widest">
                  <span className="text-violet-500/50">#</span>{order.id.slice(0, 8)}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="flex items-center gap-1.5 uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Progress */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Valor do Projeto</p>
              <p className="text-2xl font-black text-white">{formatPrice(Number(order.totalPrice))}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Status da Produção</p>
                <p className="text-xs font-black text-violet-400">{progress}%</p>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    status === 'CANCELLED' ? 'bg-red-500/50' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:col-span-3 flex lg:justify-end items-center gap-3">
            {status === 'PENDING' && (
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white text-xs font-black rounded-2xl hover:bg-violet-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-600/20">
                <Upload className="w-4 h-4" />
                ENVIAR ARQUIVOS
              </button>
            )}
            
            {status === 'IN_PROGRESS' && (
              <Link 
                href={`/minha-conta/pedido/${order.id}/chat`}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-black rounded-2xl hover:bg-white/10 hover:border-violet-500/50 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-4 h-4 text-violet-400" />
                CHAT COM EDITOR
              </Link>
            )}

            {status === 'DELIVERED' && (
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-xs font-black rounded-2xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-600/20">
                <Download className="w-4 h-4" />
                BAIXAR ENTREGA
              </button>
            )}

            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:bg-violet-500 group-hover:border-violet-500 transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>
      
      {/* Visual background decorative element */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
