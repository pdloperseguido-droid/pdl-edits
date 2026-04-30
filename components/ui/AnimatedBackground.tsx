'use client';

import { useEffect, useState } from 'react';

/**
 * AnimatedBackground inspirado na estética dark/monocromática da imagem.
 * Proporciona um visual limpo, misterioso e premium.
 */
export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 bg-[#070707] overflow-hidden pointer-events-none">
      {/* Imagem de Fundo Principal com Animação de Zoom/Pan */}
      <div 
        className="absolute inset-0 opacity-[0.6] bg-cover bg-center bg-no-repeat animate-background-pan"
        style={{
          backgroundImage: 'url("/images/bg-premium.png")',
          width: '110%',
          height: '110%',
          left: '-5%',
          top: '-5%',
        }}
      />

      {/* Overlay de Gradiente para escurecer as bordas e o topo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070707] via-transparent to-[#070707] opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] opacity-60" />

      {/* Camada de Névoa Animada 1 */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.1] mix-blend-screen animate-fog-slow"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #2a2a2a 0%, transparent 50%), radial-gradient(circle at 70% 70%, #1a1a1a 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Camada de Névoa Animada 2 */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-[0.1] mix-blend-overlay animate-fog-reverse"
        style={{
          background: 'radial-gradient(circle at 80% 20%, #333 0%, transparent 40%), radial-gradient(circle at 20% 80%, #222 0%, transparent 40%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Brilho Sutil de Acento (Roxo muito escuro, para manter a marca) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle at center, #7C3AED 0%, transparent 70%)',
          filter: 'blur(150px)',
        }}
      />

      {/* Grid de fundo sutil */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Vinheta (Vignette) para foco central */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <style jsx>{`
        @keyframes background-pan {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-2%, -2%) scale(1.05); }
        }

        @keyframes fog-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, 2%) scale(1.1); }
          66% { transform: translate(-1%, 3%) scale(0.95); }
        }

        @keyframes fog-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-2%, -2%) rotate(2deg); }
        }

        .animate-fog-slow {
          animation: fog-slow 25s ease-in-out infinite;
        }

        .animate-fog-reverse {
          animation: fog-reverse 35s linear infinite;
        }

        .animate-background-pan {
          animation: background-pan 40s ease-in-out infinite;
        }

        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
        }
      `}</style>
    </div>
  );
}
