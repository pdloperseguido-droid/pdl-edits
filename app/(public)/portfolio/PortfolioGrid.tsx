'use client';

import { useState } from 'react';
import { MoveHorizontal, Play, ExternalLink, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

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

import { PortfolioCard } from '@/components/sections/PortfolioCard';

export function PortfolioGrid({ initialItems, categories }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos'
    ? initialItems
    : initialItems.filter((i) => i.category === activeCategory);

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-12" role="group" aria-label="Filtrar por categoria">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-[12px] font-semibold tracking-wide transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-violet-600 text-white'
                : 'bg-white/[0.04] border border-white/[0.07] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.07]'
            }`}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <MoveHorizontal className="w-6 h-6 text-zinc-700" />
          </div>
          <p className="text-zinc-600 text-sm font-medium">Nenhum projeto nesta categoria ainda.</p>
        </div>
      )}
    </>
  );
}
