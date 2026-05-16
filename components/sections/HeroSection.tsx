'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/** Seção Hero minimalista e impactante */
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16"
      aria-label="Apresentação PDL Edits"
    >
      {/* Conteúdo centrado */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">

        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 badge-accent mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          Edição profissional com entrega em 72h
        </div>

        {/* Título */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold font-display leading-[0.92] tracking-tight mb-7 ${mounted ? 'animate-fade-in-up animation-delay-100' : 'opacity-0'}`}
        >
          Seus vídeos.
          <br />
          <span className="text-gradient">Reinventados.</span>
        </h1>

        {/* Subtítulo */}
        <p
          className={`text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10 ${mounted ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'}`}
        >
          Edição cinematográfica de vídeo e foto com qualidade premium,
          comunicação direta com o editor e entrega garantida.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 ${mounted ? 'animate-fade-in-up animation-delay-300' : 'opacity-0'}`}
        >
          <Link href="/catalogo">
            <Button
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ver Serviços
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Play className="w-4 h-4" />}
            >
              Ver Portfólio
            </Button>
          </Link>
        </div>

        {/* Stats inline */}
        <div
          className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-2 ${mounted ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'}`}
        >
          {[
            { value: '500+', label: 'Projetos entregues' },
            { value: '4.9★', label: 'Avaliação média' },
            { value: '72h', label: 'Prazo garantido' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl font-bold font-display text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Linha divisória na base */}
      <div className="absolute bottom-0 inset-x-0 divider" />
    </section>
  );
}
