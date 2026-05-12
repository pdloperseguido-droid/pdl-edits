import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  iconColor?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconColor = 'text-violet-400',
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden glass border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300',
        className
      )}
    >
      {/* Glow Effect */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-600/10 rounded-full blur-3xl group-hover:bg-violet-600/20 transition-all duration-500" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-black text-white tracking-tight">
            {value}
          </h3>
          {description && (
            <p className="text-[10px] text-zinc-600 mt-1 font-medium italic">
              {description}
            </p>
          )}
        </div>
        
        <div className={cn('p-3 rounded-xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform duration-500', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
            trend.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          )}>
            {trend.value}
          </span>
          <span className="text-[10px] text-zinc-600">vs. mês passado</span>
        </div>
      )}
    </div>
  );
}
