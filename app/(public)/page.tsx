import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Upload, MessageSquare, Sparkles } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortfolioPreview } from '@/components/sections/PortfolioPreview';
import { FeaturedServicesSection } from '@/components/sections/FeaturedServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FadeInSection } from '@/components/ui/FadeInSection';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDL Edits — Edição de Vídeo Profissional para Criadores e Marcas',
  description: 'Edição profissional de vídeo para Reels, Shorts, YouTube, TikTok e anúncios. Entrega em 72h com qualidade premium.',
};

/** Seção "Como funciona" — Processo claro e orientado a conversão */
function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      step: '01',
      title: 'Você envia o material',
      desc: 'Faça o pedido, envie seus arquivos brutos pelo chat do pedido. Suportamos arquivos grandes, Drive, WeTransfer e links diretos.',
    },
    {
      icon: Sparkles,
      step: '02',
      title: 'Editamos com precisão',
      desc: 'Nossa equipe organiza, corta, aplica trilha, legendas, efeitos e tratamento de cor. Você acompanha o andamento em tempo real.',
    },
    {
      icon: MessageSquare,
      step: '03',
      title: 'Você recebe e aprova',
      desc: 'O arquivo final chega pelo chat em até 72h. Se precisar de ajustes, é só pedir — revisões incluídas no prazo.',
    },
  ];

  return (
    <section className="py-20 px-5 sm:px-8" id="como-funciona" aria-labelledby="process-title">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="badge-accent inline-flex mb-4">Como funciona</p>
          <h2 id="process-title" className="uppercase text-3xl md:text-4xl font-black font-display tracking-tight">
            Do material bruto ao vídeo pronto{' '}
            <span className="text-gradient">em 3 passos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative bg-[#0a0a0a] p-8 hover:bg-[#0e0e0e] transition-colors duration-200 group">
                <span
                  className="text-[5.5rem] font-black font-display absolute top-4 right-5 leading-none select-none"
                  style={{ color: 'rgba(124,58,237,0.07)' }}
                  aria-hidden="true"
                >
                  {step.step}
                </span>

                <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>

                <h3 className="uppercase text-[14px] font-bold font-display text-white mb-2">{step.title}</h3>
                <p className="text-[13px] font-light text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA inline */}
        <div className="mt-8 text-center">
          <Link href="/catalogo">
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Quero contratar agora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Seção "O que editamos" — formatos suportados */
function FormatsSection() {
  const formats = [
    { label: 'Reels & TikTok', desc: 'Vertical, dinâmico, com gancho nos primeiros 3 segundos' },
    { label: 'YouTube Shorts', desc: 'Cortes rítmicos e legenda otimizada para retenção' },
    { label: 'YouTube Longo', desc: 'Edição narrativa, capítulos e progressão de tensão' },
    { label: 'Vídeos para Anúncio', desc: 'Hook, CTA claro e edição pensada para conversão' },
    { label: 'Conteúdo Institucional', desc: 'Produção com identidade visual da sua marca' },
    { label: 'Highlights & Clips', desc: 'Momentos fortes do seu conteúdo em formato premium' },
  ];

  return (
    <section className="py-16 px-5 sm:px-8 bg-[#050505]" aria-labelledby="formats-title">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="badge-accent inline-flex mb-4">Formatos</p>
            <h2 id="formats-title" className="uppercase text-3xl md:text-4xl font-black font-display tracking-tight">
              Editamos para<br />
              <span className="text-gradient">todos os formatos</span>
            </h2>
          </div>
          <p className="text-[13px] font-light text-zinc-500 max-w-xs">
            Do vertical para redes sociais ao horizontal para YouTube — entregamos no formato que seu público consome.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {formats.map((f, i) => (
            <div
              key={i}
              className="card p-5 group hover:border-violet-500/20 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                <h3 className="uppercase text-[13px] font-bold font-display text-white">{f.label}</h3>
              </div>
              <p className="text-[12px] font-light text-zinc-500 leading-relaxed pl-5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <div>
      <HeroSection />

      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>

      <FadeInSection>
        <FormatsSection />
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
