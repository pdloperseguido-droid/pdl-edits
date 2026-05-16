'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-[68px]"
      aria-label="PDL Edits — Edição de vídeo profissional"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">

        {/* Badge de contexto */}
        <div className={cn('inline-flex items-center gap-2 badge-accent mb-8', mounted ? 'animate-fade-in' : 'opacity-0')}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Reels · Shorts · YouTube · Anúncios · Conteúdo Institucional
        </div>

        {/* Título principal — tipografia forte */}
        <h1
          className={cn(
            'text-[clamp(2.8rem,8vw,6.5rem)] font-black font-display leading-[0.9] tracking-[-0.04em] mb-6',
            mounted ? 'animate-fade-in-up animation-delay-100' : 'opacity-0'
          )}
        >
          Seu vídeo bruto.
          <br />
          <span className="text-gradient">Pronto para vender.</span>
        </h1>

        {/* Subtítulo com copy direta */}
        <p
          className={cn(
            'text-[clamp(1rem,2.5vw,1.2rem)] text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10',
            mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
          )}
        >
          Transformamos seus vídeos brutos em conteúdos prontos para engajar, vender e fortalecer sua presença digital.{' '}
          <strong className="text-zinc-200 font-semibold">Entrega em até 72h</strong>, comunicação direta e resultado profissional garantido.
        </p>

        {/* CTAs */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-3 mb-16',
            mounted ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'
          )}
        >
          <Link href="/catalogo">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Contratar edição
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="secondary" size="lg" leftIcon={<Play className="w-4 h-4" />}>
              Ver resultados
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div
          className={cn(
            'flex flex-wrap items-center justify-center gap-x-10 gap-y-3',
            mounted ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
          )}
        >
          {[
            { value: '500+', label: 'Vídeos entregues' },
            { value: '4.9★', label: 'Avaliação dos clientes' },
            { value: '72h', label: 'Prazo médio de entrega' },
            { value: '100%', label: 'Satisfação ou refazemos' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[1.35rem] font-black font-display text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Necessário para usar cn() sem import duplicado
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
