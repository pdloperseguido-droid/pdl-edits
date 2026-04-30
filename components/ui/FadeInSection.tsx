'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

/**
 * Componente utilitário para animação de fade-in ao scroll.
 * Usa Intersection Observer para performance premium.
 */
export function FadeInSection({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = "" 
}: FadeInSectionProps) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Uma vez visível, para de observar
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Dispara quando 10% do elemento está visível
      rootMargin: '0px 0px -50px 0px' // Margem para disparar um pouco antes
    });

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  // Mapeamento de direções para classes de tradução inicial
  const directionClasses = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
    none: '',
  };

  return (
    <div
      ref={domRef}
      className={`
        transition-all duration-[1000ms] ease-[cubic-bezier(0.21,0.45,0.32,0.9)]
        ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directionClasses[direction]}`}
        ${className}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
