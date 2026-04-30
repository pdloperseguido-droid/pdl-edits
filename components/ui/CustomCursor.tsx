'use client';

import { useEffect, useState } from 'react';

/**
 * CustomCursor premium e robusto.
 * Resolve bugs de jitter separando a translação (JS) da escala (CSS).
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (!canHover) return;

    setMounted(true);
    const root = document.documentElement;
    
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      root.style.setProperty('--cursor-x', `${targetX}px`);
      root.style.setProperty('--cursor-y', `${targetY}px`);
    };

    const onMouseDown = () => root.style.setProperty('--cursor-scale', '0.7');
    const onMouseUp = () => root.style.setProperty('--cursor-scale', '1');

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        root.style.setProperty('--cursor-ring-scale', '1.5');
        root.style.setProperty('--cursor-ring-bg', 'rgba(124, 58, 237, 0.15)');
      } else {
        root.style.setProperty('--cursor-ring-scale', '1');
        root.style.setProperty('--cursor-ring-bg', 'transparent');
      }
    };

    let frameId: number;
    const updateLoop = () => {
      const ease = 0.15;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      root.style.setProperty('--cursor-ring-x', `${currentX}px`);
      root.style.setProperty('--cursor-ring-y', `${currentY}px`);

      frameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    frameId = requestAnimationFrame(updateLoop);

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(frameId);
      document.body.style.cursor = 'default';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="custom-cursor-container pointer-events-none fixed inset-0 z-[9999]">
      {/* Círculo Externo (Suave) */}
      <div 
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(calc(var(--cursor-ring-x) - 20px), calc(var(--cursor-ring-y) - 20px), 0)' }}
      >
        <div 
          className="w-10 h-10 border border-violet-500/40 rounded-full transition-all duration-300 ease-out"
          style={{ 
            transform: 'scale(var(--cursor-ring-scale, 1))',
            backgroundColor: 'var(--cursor-ring-bg, transparent)'
          }}
        />
      </div>

      {/* Ponto Central (Instantâneo) */}
      <div 
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(calc(var(--cursor-x) - 4px), calc(var(--cursor-y) - 4px), 0)' }}
      >
        <div 
          className="w-2 h-2 bg-violet-500 rounded-full transition-transform duration-200 ease-out"
          style={{ transform: 'scale(var(--cursor-scale, 1))' }}
        />
      </div>

      <style jsx global>{`
        /* Oculta o cursor padrão em elementos interativos */
        a, button, [role="button"], input, select, textarea, .cursor-pointer {
          cursor: none !important;
        }
        body {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
