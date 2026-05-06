import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Clock, Star, Zap, Shield, Film } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortfolioPreview } from '@/components/sections/PortfolioPreview';
import { FeaturedServicesSection } from '@/components/sections/FeaturedServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'PDL Edits — Edição de Vídeo e Foto Profissional',
  description: 'Transforme seus momentos em obras de arte. Edição profissional com entrega rápida e qualidade premium.',
};

// Seção "Como Funciona"
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
      desc: 'Em até 72 horas você recebe o arquivo final direto no chat. Revisões incluídas!',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6" id="como-funciona" aria-labelledby="how-it-works-title">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-3">
            Processo
          </p>
          <h2 id="how-it-works-title" className="text-4xl md:text-5xl font-bold font-display">
            Como <span className="text-gradient">funciona</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Linha conectora (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
            aria-hidden="true"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative border-gradient p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {/* Número */}
                <span className="text-7xl font-bold font-display text-white/4 absolute top-4 right-4 leading-none select-none" aria-hidden="true">
                  {step.step}
                </span>

                {/* Ícone */}
                <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-6 glow-purple-sm">
                  <Icon className="w-8 h-8 text-white" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold font-display text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// Seção de garantias
function GuaranteesSection() {
  const items = [
    { icon: Shield, title: 'Satisfação garantida', desc: 'Revisões ilimitadas até você ficar satisfeito.' },
    { icon: Clock, title: 'Entrega no prazo', desc: 'Cumprimos sempre o prazo acordado, sem desculpas.' },
    { icon: Star, title: 'Qualidade premium', desc: 'Editores experientes com ferramentas profissionais.' },
    { icon: MessageSquare, title: 'Suporte direto', desc: 'Chat exclusivo com o editor para cada pedido.' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6" aria-labelledby="guarantees-title">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="guarantees-title" className="text-4xl font-bold font-display">
            Por que escolher a <span className="text-gradient">PDL Edits?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass border border-white/5 rounded-2xl p-6 text-center animate-fade-in-up bg-transparent"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-violet-400" aria-hidden="true" />
                </div>
                <h3 className="font-bold font-display text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { FadeInSection } from '@/components/ui/FadeInSection';

/** Página inicial */
export default async function HomePage() {
  return (
    <div className="bg-transparent">
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

      <FadeInSection>
        <GuaranteesSection />
      </FadeInSection>
    </div>
  );
}
