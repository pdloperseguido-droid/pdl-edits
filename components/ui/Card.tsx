import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'gradient';
  hover?: boolean;
}

const variants = {
  default: 'bg-[#111111] border border-white/5',
  glass: 'glass',
  bordered: 'border-gradient',
  gradient: 'bg-gradient-to-br from-violet-950/40 to-purple-950/20 border border-violet-500/20',
};

/** Card com variantes glass/gradient/bordered */
export function Card({ variant = 'default', hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        variants[variant],
        hover && 'hover-lift cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pb-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
