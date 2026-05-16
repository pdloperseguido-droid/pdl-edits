'use client';

import Link from 'next/link';
import { ArrowRight, Check, Clock, Star, Film } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice, safeParseJSON } from '@/lib/utils';

interface ServiceCardProps {
  service: any;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const features = safeParseJSON<string[]>(service.features, []);
  const tags = (service.tags || '').split(',').filter(Boolean);
  const title = service.title.replace('Higlights', 'Highlights');

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        service.isFeatured
          ? 'bg-[#110d1a] border border-violet-500/25 ring-1 ring-violet-500/10'
          : 'card'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        <img
          src={service.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Badges no topo */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {service.isFeatured && (
            <span className="flex items-center gap-1 badge-accent text-[10px] px-2 py-0.5">
              <Star className="w-2.5 h-2.5 fill-violet-400" />
              Destaque
            </span>
          )}
          {tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Título e descrição */}
        <div>
          <h3 className="uppercase text-[16px] font-bold font-display text-white mb-1.5 group-hover:text-violet-300 transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-[12px] font-light text-zinc-500 leading-relaxed line-clamp-2">
            {service.shortDescription}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 flex-1">
          {features.slice(0, 4).map((f: string) => (
            <li key={f} className="flex items-start gap-2 text-[12px] font-light text-zinc-400">
              <Check className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
          {features.length > 4 && (
            <li className="text-[11px] font-light text-zinc-500 pl-5">+{features.length - 4} itens inclusos</li>
          )}
        </ul>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-medium tracking-widest mb-0.5">A partir de</p>
            <div className="flex items-center gap-2">
              {service.slug === 'combo-highlight-thumbnail' && (
                <span className="text-xs text-zinc-600 line-through">R$ 75,00</span>
              )}
              <span className="text-xl font-black font-display text-white">{formatPrice(Number(service.price))}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-[11px] text-zinc-600">
              <Clock className="w-3 h-3" />
              <span>{service.deliveryDays}d</span>
            </div>
            <Link href={`/catalogo/${service.slug}`}>
              <Button
                variant={service.isFeatured ? 'primary' : 'outline'}
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Ver detalhes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
