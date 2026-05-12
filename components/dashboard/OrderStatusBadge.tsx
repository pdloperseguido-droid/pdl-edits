import { cn } from '@/lib/utils';
import { OrderStatus } from '@/lib/db/schema';
import { Clock, CheckCircle2, AlertCircle, PlayCircle, Search, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  PENDING: {
    label: 'Pendente',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: 'Em Edição',
    color: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    icon: PlayCircle,
  },
  REVIEW: {
    label: 'Em Revisão',
    color: 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20',
    icon: Search,
  },
  DELIVERED: {
    label: 'Entregue',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    icon: XCircle,
  },
};

export function OrderStatusBadge({ status, className, showIcon = true }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300',
        config.color,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </div>
  );
}
