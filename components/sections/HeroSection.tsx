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
      className="relative min-h-[90vh] flex items-center justify-center pt-[68px] overflow-hidden"
      aria-label="PDL Edits — Edição de vídeo profissional"
    >
      {/* Background radial glow para simular o efeito da imagem */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">

        {/* Badge de contexto */}
        <div className={cn('inline-flex items-center gap-2 badge-accent mb-8', mounted ? 'animate-fade-in' : 'opacity-0')}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="uppercase text-[10px] sm:text-[11px] font-bold tracking-widest text-zinc-300">
            Reels · Shorts · YouTube · Anúncios · Conteúdo Institucional
          </span>
        </div>

        {/* Título principal — tipografia forte */}
        <h1
          className={cn(
            'font-heading text-4xl md:text-6xl lg:text-[6.5rem] font-extrabold tracking-[-0.045em] leading-[0.95] mb-6',
            mounted ? 'animate-fade-in-up animation-delay-100' : 'opacity-0'
          )}
        >
          SEU MATERIAL ORIGINAL.
          <br />
          <span className="text-[#A855F7]">PRONTO PARA VENDER.</span>
        </h1>

        {/* Subtítulo com copy direta */}
        <p
          className={cn(
            'font-sans text-[clamp(1rem,2vw,1.1rem)] text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed mb-8',
            mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
          )}
        >
          Transformamos gravações soltas em vídeos editados com ritmo, retenção e acabamento comercial.{' '}
          <strong className="text-white font-semibold">Entrega em até 72h</strong>, comunicação direta e padrão visual pronto para publicar.
        </p>

        {/* CTAs */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-3 mb-12',
            mounted ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'
          )}
        >
          <Link href="/catalogo">
            <Button size="lg" className="rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] px-8 py-6 font-sans text-[15px] font-semibold tracking-[-0.01em]" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Contratar edição
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="outline" size="lg" className="rounded-full border-white/10 hover:bg-white/5 bg-transparent px-8 py-6 font-sans text-[15px] font-medium tracking-[-0.01em]" leftIcon={<Play className="w-4 h-4 text-zinc-400" />}>
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
            { value: '200+' },
            { value: '4.9★' },
            { value: '72h' },
            { value: '100%' },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-[1.8rem] font-black font-display text-white tracking-tight">{s.value}</p>
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
