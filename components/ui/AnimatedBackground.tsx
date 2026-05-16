'use client';

import { useEffect, useState } from 'react';

/**
 * Background mínimo e moderno.
 * Fundo sólido escuro com grid ultra-sutil e um único brilho de acento.
 */
export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ background: '#080808' }}>
      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />

      {/* Brilho radial de acento — único, centrado, bem discreto */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-[0.07]"
        style={{
          background: 'radial-gradient(ellipse at center, #7C3AED 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Gradiente de vinheta nas bordas */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
    </div>
  );
}
