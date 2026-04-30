'use client';

import { useState, useRef } from 'react';
import { MoveHorizontal, Play } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { Badge } from '@/components/ui/Badge';

interface PortfolioCardProps {
  item: {
    id: string;
    title: string;
    category: string;
    beforeUrl: string;
    afterUrl: string;
    type: string;
    description?: string | null;
  };
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isVideo = item.type?.toUpperCase() === 'VIDEO';

  // Helper para obter thumbnail do YouTube se necessário
  const getThumbnail = () => {
    if (!isVideo) return item.afterUrl;
    if (item.beforeUrl && item.beforeUrl.startsWith('http')) return item.beforeUrl;

    // Se for vídeo e não tiver beforeUrl, tenta pegar do YouTube
    const ytMatch = item.afterUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    }

    return item.beforeUrl; // Fallback
  };

  const thumbnailUrl = getThumbnail();

  return (
    <div
      className="relative rounded-2xl overflow-hidden group hover-lift bg-zinc-900 border border-white/5"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setSliderValue(50); }}
      ref={containerRef}
    >
      <div className="aspect-video relative overflow-hidden">
        {isVideo ? (
          <div className="w-full h-full">
            <VideoPlayer url={item.afterUrl} title={item.title} />
          </div>
        ) : (
          <div className="w-full h-full relative">
            {/* Imagem "depois" (base) */}
            <img
              src={thumbnailUrl}
              alt={`${item.title} — resultado`}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Imagem "antes" com clip */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <img
                src={item.beforeUrl}
                alt={`${item.title} — antes`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Label ANTES */}
              <div className="absolute top-3 left-3 glass text-[10px] font-bold px-2 py-0.5 rounded text-white">
                ANTES
              </div>
            </div>

            {/* Label DEPOIS */}
            <div className="absolute top-3 right-3 glass text-[10px] font-bold px-2 py-0.5 rounded text-violet-300">
              DEPOIS
            </div>

            {/* Linha divisória */}
            {isHovering && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <MoveHorizontal className="w-3 h-3 text-black" />
                </div>
              </div>
            )}

            {/* Slider invisível para controle */}
            {isHovering && (
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize before-after-slider"
                aria-label={`Slider before/after de ${item.title}`}
              />
            )}
          </div>
        )}
      </div>

      {/* Info bar (always visible now since we removed modal) */}
      <div className="p-4 bg-zinc-950/50 backdrop-blur-sm border-t border-white/5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Badge variant="category" size="sm">{item.category}</Badge>
          <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
            {isVideo ? 'Video' : 'Photo'}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
        {item.description && (
          <p className="text-xs text-zinc-500 line-clamp-1 mt-1">{item.description}</p>
        )}
      </div>
    </div>
  );
}
