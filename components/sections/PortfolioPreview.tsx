import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PortfolioCard } from './PortfolioCard';
import { getPortfolioItems } from '@/server/actions/portfolio';

/** Preview do portfólio na home */
export async function PortfolioPreview() {
  // Busca apenas os itens em destaque para a home
  const items = await getPortfolioItems(undefined, true);
  
  // Limita a 6 itens se houver mais
  const featuredItems = items.slice(0, 6);

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-6" aria-labelledby="portfolio-title">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-3">
              Portfólio
            </p>
            <h2 id="portfolio-title" className="text-4xl md:text-5xl font-bold font-display">
              Nosso trabalho
              <br />
              <span className="text-gradient">fala por si</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium group transition-colors"
          >
            Ver portfólio completo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredItems.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <PortfolioCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
