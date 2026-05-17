import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PortfolioCard } from './PortfolioCard';
import { getPortfolioItems } from '@/server/actions/portfolio';

/** Preview do portfólio na home */
export async function PortfolioPreview() {
  const items = await getPortfolioItems(undefined, true);
  const featuredItems = items.slice(0, 6);

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6" aria-labelledby="portfolio-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="badge-accent inline-flex mb-4">Portfólio</p>
            <h2 id="portfolio-title" className="font-heading uppercase text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-tight">
              Nosso trabalho
              <br />
              <span className="text-gradient">fala por si</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-sans text-[13px] font-medium text-zinc-400 transition-all duration-200 ease-out hover:text-white hover:bg-white/5 group"
          >
            Ver portfólio completo
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredItems.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
