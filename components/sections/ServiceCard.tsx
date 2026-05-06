'use client';

import Link from 'next/link';
import { ArrowRight, Check, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface ServiceCardProps {
  service: any;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const features = JSON.parse(service.features || '[]');
  const tags = (service.tags || '').split(',').filter(Boolean);
  
  // Corrigir erro de digitação comum do usuário no banco (Higlights -> Highlights)
  const title = service.title.replace('Higlights', 'Highlights');

  return (
    <div
      className={`group relative rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 hover:scale-[1.02] ${
        service.isFeatured
          ? 'bg-gradient-to-br from-violet-950/40 to-fuchsia-950/20 border border-violet-500/30 glow-purple-sm'
          : 'glass-strong border border-white/5'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Thumbnail Area */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={service.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        {/* Floating Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {service.isFeatured && (
            <span className="flex items-center gap-1 bg-violet-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
              <Star className="w-3 h-3 fill-white" /> Destaque
            </span>
          )}
          {tags.map((tag: string) => (
            <span key={tag} className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-violet-400 transition-colors">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
            {service.shortDescription}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-sm font-bold text-zinc-500">5.0 (Novo)</span>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-8">
          {features.slice(0, 3).map((f: string) => (
            <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
              <div className="mt-1 w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-violet-400" />
              </div>
              <span>{f}</span>
            </li>
          ))}
          {features.length > 3 && (
            <li className="text-xs text-zinc-500 pl-7 font-medium">+{features.length - 3} itens inclusos</li>
          )}
        </ul>

        {/* Bottom Bar */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">Entrega em {service.deliveryDays} dias</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-0.5">A partir de</span>
              {service.slug === 'combo-highlight-thumbnail' && (
                <span className="text-xs text-zinc-500 line-through mr-2 font-bold">R$ 75,00</span>
              )}
              <span className="text-2xl font-black text-white">{formatPrice(Number(service.price))}</span>
            </div>
          </div>

          <Link href={`/catalogo/${service.slug}`} className="block">
            <Button
              variant={service.isFeatured ? 'primary' : 'secondary'}
              size="lg"
              className="w-full rounded-2xl font-black text-xs uppercase tracking-[0.2em] py-5 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
              rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            >
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
