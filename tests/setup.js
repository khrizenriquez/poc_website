import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

export const mediaListeners = new Set();
export function setMotion(matches) {
  window.matchMedia = vi.fn((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (_, listener) => mediaListeners.add(listener),
    removeEventListener: (_, listener) => mediaListeners.delete(listener),
  }));
}
beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = vi.fn();
  setMotion(true);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterEach(() => {
  cleanup();
  mediaListeners.clear();
  document.body.style.overflow = '';
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
  document.querySelector('meta[name="theme-color"]')?.remove();
});
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    utils: { toArray: (selector, scope) => [...scope.querySelectorAll(selector)] },
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));
vi.mock('@gsap/react', async () => {
  const { useLayoutEffect } = await import('react');
  return { useGSAP: (callback, config) => useLayoutEffect(callback, config.dependencies) };
});
