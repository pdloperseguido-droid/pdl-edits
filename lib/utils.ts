import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utilitário para combinar classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata preço em BRL */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/** Formata data em pt-BR */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/** Formata data + hora em pt-BR */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** Formata hora relativa (ex: "há 5 minutos") */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'agora';
  if (minutes < 60) return `há ${minutes}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return formatDate(date);
}

/** Labels de status do pedido */
export const STATUS_LABELS: Record<string, string> = {
  PENDING:     'Pendente',
  CONFIRMED:   'Confirmado',
  IN_PROGRESS: 'Em andamento',
  REVIEW:      'Em revisão',
  DELIVERED:   'Entregue',
  CANCELLED:   'Cancelado',
};

/** Cores de status */
export const STATUS_COLORS: Record<string, string> = {
  PENDING:     'text-amber-400 bg-amber-400/10 border-amber-400/20',
  CONFIRMED:   'text-blue-400 bg-blue-400/10 border-blue-400/20',
  IN_PROGRESS: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  REVIEW:      'text-orange-400 bg-orange-400/10 border-orange-400/20',
  DELIVERED:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  CANCELLED:   'text-red-400 bg-red-400/10 border-red-400/20',
};

/** Gera slug a partir de string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
