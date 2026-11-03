import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true,
  );
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = (event) => setReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}
export function usePageMotion(scope, identity) {
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || !scope.current) return;
      gsap.utils.toArray('[data-reveal]', scope.current).forEach((element) => {
        gsap.fromTo(
          element,
          { y: 32, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true },
          },
        );
      });
      gsap.utils.toArray('[data-parallax]', scope.current).forEach((frame) => {
        const image = frame.querySelector('img');
        if (!image) return;
        gsap.fromTo(
          image,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      const artwork = scope.current.querySelector('.hero-visual');
      if (artwork)
        gsap.to(artwork, {
          y: 90,
          rotate: 7,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: '+=850', scrub: 1 },
        });
    },
    { scope, dependencies: [identity, reduced], revertOnUpdate: true },
  );
}
