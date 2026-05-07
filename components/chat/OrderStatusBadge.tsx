'use client';

import { cn, STATUS_LABELS, STATUS_COLORS } from '@/lib/utils';
import type { OrderStatus } from '@/lib/db/schema';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_ICONS: Record<OrderStatus, string> = {
  PENDING:     '⏳',
  CONFIRMED:   '✅',
  IN_PROGRESS: '🔨',
  REVIEW:      '👀',
  DELIVERED:   '🎉',
  CANCELLED:   '❌',
};

/** Badge de status do pedido com ícone e cor */
export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        STATUS_COLORS[status],
        size === 'sm'  && 'text-xs px-2 py-0.5',
        size === 'md'  && 'text-sm px-3 py-1',
        size === 'lg'  && 'text-base px-4 py-1.5',
      )}
    >
      <span aria-hidden="true">{STATUS_ICONS[status]}</span>
      {STATUS_LABELS[status]}
    </span>
  );
}

/** Dropdown para admin alterar status */
interface StatusDropdownProps {
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (status: OrderStatus) => void;
  isLoading?: boolean;
}

const STATUS_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'REVIEW', 'DELIVERED', 'CANCELLED'];

export function StatusDropdown({ currentStatus, onStatusChange, isLoading }: StatusDropdownProps) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
      disabled={isLoading || currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED'}
      className={cn(
        'bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm font-medium',
        'focus:outline-none focus:border-violet-500/50 transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        STATUS_COLORS[currentStatus]
      )}
      aria-label="Alterar status do pedido"
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s} className="bg-[#1a1a1a] text-white">
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
