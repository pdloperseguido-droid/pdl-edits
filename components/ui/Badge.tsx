import { cn } from '@/lib/utils';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status' | 'category';
  status?: string;
  size?: 'sm' | 'md';
}

/** Badge com suporte a status de pedido, categoria e variante padrão */
export function Badge({ variant = 'default', status, size = 'md', className, children, ...props }: BadgeProps) {
  const isStatus = variant === 'status' && status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs',
        isStatus
          ? STATUS_COLORS[status] ?? 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
          : variant === 'category'
            ? 'text-violet-300 bg-violet-500/10 border-violet-500/20'
            : 'text-zinc-300 bg-white/5 border-white/10',
        className
      )}
      {...props}
    >
      {isStatus && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {isStatus ? (STATUS_LABELS[status] ?? status) : children}
    </span>
  );
}

/** Badge de notificação numérica (para navbar) */
export function NotificationBadge({ count, className }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 w-5 h-5 rounded-full',
        'bg-violet-600 text-white text-[10px] font-bold',
        'flex items-center justify-center',
        'animate-pulse-glow',
        className
      )}
      aria-label={`${count} notificações não lidas`}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}
