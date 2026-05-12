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
      className="group relative glass border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Thumbnail/Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
          {order.service?.thumbnailUrl ? (
            <img src={order.service.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Package className="w-6 h-6 text-violet-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white truncate text-lg group-hover:text-violet-400 transition-colors">
              {order.service?.title ?? 'Serviço Personalizado'}
            </h4>
            <OrderStatusBadge status={status} className="flex-shrink-0" />
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 font-mono uppercase">
              <span className="text-zinc-700">#</span>
              <span>{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-zinc-300">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>{formatPrice(Number(order.totalPrice))}</span>
            </div>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="w-full sm:w-32">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Progresso</span>
              <span className="text-[10px] text-violet-400 font-bold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  status === 'CANCELLED' ? 'bg-red-500/50' : 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === 'PENDING' && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
                <Upload className="w-3 h-3" />
                ENVIAR ARQUIVOS
              </button>
            )}
            
            {status === 'IN_PROGRESS' && (
              <Link 
                href={`/minha-conta/pedido/${order.id}/chat`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 text-violet-400 text-[10px] font-bold rounded-lg border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="w-3 h-3" />
                FALAR COM EDITOR
              </Link>
            )}

            {status === 'DELIVERED' && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                <Download className="w-3 h-3" />
                BAIXAR ENTREGA
              </button>
            )}

            <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-600 group-hover:text-white group-hover:bg-violet-500/20 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual background hint */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-violet-500/0 to-transparent group-hover:via-violet-500/50 transition-all duration-500" />
    </div>
  );
}
