import type { Metadata } from 'next';
import { getPortfolioItems } from '@/server/actions/portfolio';
import { PortfolioGrid } from './PortfolioGrid';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';

export const metadata: Metadata = {
  title: 'Nosso Portfólio',
  description: 'Veja como transformamos material bruto em conteúdo que impressiona. Confira nossos projetos de edição de vídeo e foto.',
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();
  
  // Extrair categorias únicas dos itens do banco de dados
  const dynamicCategories = ['Todos', ...Array.from(new Set(items.map(i => i.category)))];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-3">Portfólio</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            Nosso <span className="text-gradient">trabalho</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Cada projeto é único. Veja como transformamos material bruto em conteúdo que impressiona.
          </p>
        </div>

        <PortfolioGrid initialItems={items} categories={dynamicCategories} />

        <div className="mt-20 border-t border-white/5 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white">Por que <span className="text-gradient">nos escolher?</span></h2>
          </div>
          <FeaturesGrid />
        </div>
      </div>
    </div>
  );
}
