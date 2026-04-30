'use client';

import { useState } from 'react';
import { MoveHorizontal, Play } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  beforeUrl: string;
  afterUrl: string;
  type: string;
  description: string | null;
}

interface PortfolioGridProps {
  initialItems: PortfolioItem[];
  categories: string[];
}

function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [value, setValue] = useState(50);

  return (
    <div className="relative w-full h-full select-none">
      {/* After */}
      <img src={after} alt={`${title} — depois`} className="w-full h-full object-cover" />
      {/* Before com clip */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <img src={before} alt={`${title} — antes`} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">ANTES</div>
      </div>
      <div className="absolute top-3 right-3 bg-violet-600/80 text-white text-xs font-bold px-2 py-1 rounded">DEPOIS</div>
      {/* Divisor */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{ left: `${value}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
          <MoveHorizontal className="w-5 h-5 text-black" />
        </div>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Slider antes/depois"
      />
    </div>
  );
}

import { PortfolioCard } from '@/components/sections/PortfolioCard';

export function PortfolioGrid({ initialItems, categories }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos'
    ? initialItems
    : initialItems.filter((i) => i.category === activeCategory);

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-2 mb-16" role="group" aria-label="Filtrar por categoria">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'glass border border-white/5 text-zinc-500 hover:text-white hover:border-white/15'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, i) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <MoveHorizontal className="w-8 h-8 text-zinc-700" />
          </div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Nenhum item nesta categoria ainda.</p>
        </div>
      )}
    </>
  );
}
