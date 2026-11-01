import { useEffect, useRef } from 'react';

/** O conteúdo começa visível; apenas elementos fora da tela recebem animação de entrada. */
export default function useReveal(contentKey) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const elements = [...container.querySelectorAll('[data-reveal]')];
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;

    const revealAll = () => {
      observer?.disconnect();
      elements.forEach((element) => {
        element.dataset.revealState = 'visible';
      });
    };

    const observe = () => {
      revealAll();
      if (preference.matches || !('IntersectionObserver' in window)) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
              entry.target.dataset.revealState = 'visible';
              observer.unobserve(entry.target);
            } else {
              entry.target.dataset.revealState = 'pending';
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
      );

      // O navegador fornece a geometria de forma assíncrona; não force o cálculo do leiaute durante a montagem.
      elements.forEach(element => observer.observe(element));
    };

    observe();
    preference.addEventListener('change', observe);

    return () => {
      preference.removeEventListener('change', observe);
      revealAll();
    };
  }, [contentKey]);

  return containerRef;
}
