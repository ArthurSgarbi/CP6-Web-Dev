import { useCallback, useEffect, useState } from 'react';

const SECTION_IDS = ['work', 'exploration', 'journal'];

export default function useAnchorNavigation() {
  const [activeSection, setActiveSection] = useState('');

  const navigate = useCallback((event, targetId) => {
    if (
      event?.metaKey ||
      event?.ctrlKey ||
      event?.shiftKey ||
      event?.altKey ||
      (typeof event?.button === 'number' && event.button !== 0)
    ) return;

    const id = targetId.replace(/^#/, '');
    const target = document.getElementById(id);
    if (!target) return;

    event?.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });

    // Move keyboard focus along with the viewport, without an additional scroll.
    const temporaryTabIndex = !target.hasAttribute('tabindex');
    if (temporaryTabIndex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (temporaryTabIndex) {
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }

    const hash = `#${id}`;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    setActiveSection(SECTION_IDS.includes(id) ? id : '');
  }, []);

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      setActiveSection(SECTION_IDS.includes(id) ? id : '');
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const visibleSections = new Set();
    let observer;

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visibleSections.add(entry.target.id);
            else visibleSections.delete(entry.target.id);
          });
          const current = SECTION_IDS.find((id) => visibleSections.has(id));
          setActiveSection(current ?? '');
        },
        { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
      );
      sections.forEach((section) => observer.observe(section));
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  return { activeSection, navigate };
}
