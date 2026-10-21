import { useEffect, useRef } from 'react';

/** Content starts visible; only offscreen elements receive an entrance animation. */
export default function useReveal() {
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
            if (!entry.isIntersecting) return;
            entry.target.dataset.revealState = 'visible';
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
      );

      elements.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.dataset.revealState = 'pending';
        observer.observe(element);
      });
    };

    observe();
    preference.addEventListener('change', observe);

    return () => {
      preference.removeEventListener('change', observe);
      revealAll();
    };
  }, []);

  return containerRef;
}
