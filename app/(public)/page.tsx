import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { MessageSquare, Zap, Film } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortfolioPreview } from '@/components/sections/PortfolioPreview';
import { FeaturedServicesSection } from '@/components/sections/FeaturedServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FadeInSection } from '@/components/ui/FadeInSection';

export const metadata: Metadata = {
  title: 'PDL Edits — Edição de Vídeo e Foto Profissional',
  description: 'Transforme seus momentos em obras de arte. Edição profissional com entrega rápida e qualidade premium.',
};

/** Seção "Como Funciona" — minimalista */
function HowItWorksSection() {
  const steps = [
    {
      icon: Film,
      step: '01',
      title: 'Escolha o serviço',
      desc: 'Navegue pelo catálogo, selecione o serviço ideal e descreva seu projeto com detalhes.',
    },
    {
      icon: MessageSquare,
      step: '02',
      title: 'Envie seu material',
      desc: 'Após confirmar o pedido, envie seus arquivos pelo chat exclusivo do pedido.',
    },
    {
      icon: Zap,
      step: '03',
      title: 'Receba a entrega',
      desc: 'Em até 72 horas você recebe o arquivo final direto no chat.',
    },
  ];

  return (
    <section className="py-28 px-4 sm:px-6" id="como-funciona" aria-labelledby="how-it-works-title">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="badge-accent inline-flex mb-4">Processo</p>
          <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold font-display">
            Como funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative bg-[#080808] p-8 hover:bg-[#0d0d0d] transition-colors duration-200"
              >
                {/* Número do step */}
                <span
                  className="text-7xl font-bold font-display absolute top-5 right-6 leading-none select-none"
                  style={{ color: 'rgba(124,58,237,0.08)' }}
                  aria-hidden="true"
                >
                  {step.step}
                </span>

                {/* Ícone */}
                <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>

                <h3 className="text-base font-semibold font-display text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Página inicial */
export default async function HomePage() {
  return (
    <div>
      <HeroSection />

      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>

      <FadeInSection>
        <PortfolioPreview />
      </FadeInSection>

      <FadeInSection>
        <FeaturedServicesSection />
      </FadeInSection>

      <FadeInSection>
        <TestimonialsSection />
      </FadeInSection>
    </div>
  );
}
