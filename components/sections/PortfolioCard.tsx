'use client';

import { useState, useRef } from 'react';
import { MoveHorizontal, Play, ExternalLink } from 'lucide-react';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

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

// Mapa de categorias para tags de formato
const FORMAT_TAGS: Record<string, string[]> = {
  'Reels': ['Reels', 'Instagram'],
  'Shorts': ['Shorts', 'YouTube'],
  'YouTube': ['YouTube'],
  'TikTok': ['TikTok'],
  'Anúncio': ['Tráfego Pago'],
  'Highlights': ['Highlights'],
  'Thumbnail': ['Thumbnail'],
};

export function PortfolioCard({ item }: PortfolioCardProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const isVideo = item.type?.toUpperCase() === 'VIDEO';

  const getThumbnail = () => {
    if (!isVideo) return item.afterUrl;
    if (item.beforeUrl?.startsWith('http')) return item.beforeUrl;
    const ytMatch = item.afterUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    return item.beforeUrl;
  };

  const thumbnailUrl = getThumbnail();
  const categoryTags = FORMAT_TAGS[item.category] || [item.category];

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-zinc-900/80 border border-white/[0.06] hover:border-violet-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setSliderValue(50); }}
    >
      {/* Mídia */}
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        {isVideo ? (
          <VideoPlayer url={item.afterUrl} title={item.title} />
        ) : (
          <div className="relative w-full h-full">
            {/* Imagem "depois" */}
            <img
              src={thumbnailUrl}
              alt={`${item.title} — resultado`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900';
              }}
            />

            {/* Imagem "antes" com clip */}
            {isHovering && item.beforeUrl && (
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
              >
                <img
                  src={item.beforeUrl}
                  alt={`${item.title} — antes`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=900';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Antes
                </div>
              </div>
            )}

            {/* Label DEPOIS */}
            {isHovering && item.beforeUrl && (
              <div className="absolute top-2.5 right-2.5 bg-violet-600/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Depois
              </div>
            )}

            {/* Linha divisória */}
            {isHovering && item.beforeUrl && (
              <div
                className="absolute top-0 bottom-0 w-px bg-white/80 pointer-events-none"
                style={{ left: `${sliderValue}%` }}
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <MoveHorizontal className="w-3.5 h-3.5 text-black" />
                </div>
              </div>
            )}

            {/* Slider invisível */}
            {isHovering && item.beforeUrl && (
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize before-after-slider"
                aria-label={`Comparar antes e depois de ${item.title}`}
              />
            )}

            {/* Hint de interação no hover (sem before) */}
            {!isHovering && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-black/70 backdrop-blur-sm text-white/90 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wide">
            {item.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-zinc-950/60 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="uppercase text-[13px] font-bold font-display text-white leading-snug truncate">
            {item.title}
          </h3>
          <span className="text-[10px] text-zinc-600 uppercase font-semibold flex-shrink-0 mt-0.5">
            {isVideo ? 'Vídeo' : 'Foto'}
          </span>
        </div>

        {item.description && (
          <p className="text-[11px] font-light text-zinc-500 line-clamp-1 mb-2">{item.description}</p>
        )}

        {/* Format tags */}
        <div className="flex flex-wrap gap-1">
          {categoryTags.map((tag) => (
            <span key={tag} className="text-[9px] font-light text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
