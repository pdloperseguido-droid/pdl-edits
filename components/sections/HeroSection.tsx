'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';


/** Stats badge animado */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass border border-white/8 rounded-2xl px-5 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
        <Star className="w-4 h-4 text-violet-400 fill-violet-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

/** Seção Hero fullscreen */
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>

      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Apresentação PDL Edits"
      >
        {/* Background gradiente animado */}
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700/20 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-700/15 rounded-full blur-[100px] animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[160px]" />
        </div>

        {/* Grid de fundo sutil */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* Conteúdo */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badge de destaque */}
          <div
            className={`inline-flex items-center gap-2 glass border border-violet-500/20 rounded-full px-4 py-2 text-sm text-violet-300 mb-8 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <Sparkles className="w-4 h-4" />
            Edição Profissional com Entrega Rápida
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Título principal */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-display leading-[0.9] tracking-tight mb-8 ${mounted ? 'animate-fade-in-up animation-delay-100' : 'opacity-0'}`}
          >
            Seus vídeos.
            <br />
            <span className="text-gradient">Reinventados.</span>
          </h1>

          {/* Subtítulo */}
          <p
            className={`text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12 ${mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}
          >
            Edição cinematográfica de vídeo e foto com qualidade premium,
            comunicação direta com o editor e entrega em até{' '}
            <strong className="text-violet-400">72 horas</strong>.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${mounted ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}
          >
            <Link href="/catalogo">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                className="group animate-pulse-glow"
              >
                Ver Serviços
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Play className="w-5 h-5" />}
              >
                Ver Portfólio
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 ${mounted ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'}`}
          >
            <StatBadge value="500+" label="Projetos entregues" />
            <StatBadge value="4.9★" label="Avaliação média" />
            <StatBadge value="72h" label="Prazo de entrega" />
          </div>
        </div>

        {/* Seta de scroll */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-violet-400 rounded-full animate-float" />
          </div>
        </div>
      </section>
    </>
  );
}
