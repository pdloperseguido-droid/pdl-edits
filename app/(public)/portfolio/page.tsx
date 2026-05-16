import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import { getPortfolioItems } from '@/server/actions/portfolio';
import { PortfolioGrid } from './PortfolioGrid';
import { FAQSection } from '@/components/sections/FAQSection';

export const metadata: Metadata = {
  title: 'Portfólio de Edição de Vídeo',
  description: 'Veja exemplos reais de edição de vídeo profissional para Reels, YouTube, Shorts e anúncios. Resultados que falam por si.',
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();
  const dynamicCategories = ['Todos', ...Array.from(new Set(items.map((i) => i.category)))];

  return (
    <div className="min-h-screen pt-28 pb-16 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p className="badge-accent inline-flex mb-4">Portfólio</p>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4">
            Resultados reais,
            <br />
            <span className="text-gradient">projetos entregues</span>
          </h1>
          <p className="text-[15px] text-zinc-400 max-w-xl leading-relaxed">
            Cada projeto aqui foi entregue a um criador real. Navegue pelas categorias
            e veja o antes e depois passando o mouse sobre as imagens.
          </p>
        </div>

        <PortfolioGrid initialItems={items} categories={dynamicCategories} />

        {/* FAQ — substitui "Por que nos escolher?" */}
        <div className="mt-28">
          <FAQSection />
        </div>
      </div>
    </div>
  );
}
