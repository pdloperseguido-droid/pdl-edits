'use client';

import { useEffect, useState } from 'react';

/**
 * Background premium com imagem + sobreposição gradiente suave.
 * Restaurado para preservar o visual anterior com bg-premium.png.
 */
export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#080808]">
      {/* Imagem de fundo com zoom/pan suave */}
      <div
        className="absolute inset-[-5%] opacity-50"
        style={{
          backgroundImage: 'url("/images/bg-premium.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'bgPan 50s ease-in-out infinite',
        }}
      />

      {/* Gradiente escurecendo topo e base para garantir legibilidade do header e footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808] opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-transparent to-[#080808]/70" />

      {/* Acento violeta centralizado muito sutil */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.06]"
        style={{
          background: 'radial-gradient(ellipse at center, #7C3AED 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Vinheta para foco central */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)' }}
      />

      <style>{`
        @keyframes bgPan {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.04) translate(-1%, -1%); }
        }
      `}</style>
    </div>
  );
}
