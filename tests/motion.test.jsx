import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import gsap from 'gsap';
import { usePageMotion, useReducedMotion } from '../src/components/Motion';
import { mediaListeners, setMotion } from './setup';

function MotionProbe({ artwork = true, attached = true, identity = 'home', photos = false }) {
  const scope = useRef(null);
  usePageMotion(scope, identity);
  return (
    <div ref={attached ? scope : undefined}>
      <p data-reveal>Content</p>
      {artwork && <div className="hero-visual">Art</div>}
      {photos && (
        <>
          <figure data-parallax>
            <img src="/large-photo.jpg" alt="Panorama" />
            <figcaption>Fixed caption</figcaption>
          </figure>
          <div data-parallax>
            <img src="/editorial-photo.jpg" alt="Editorial" />
          </div>
          <div data-parallax />
          <img src="/small-photo.jpg" alt="Thumbnail" />
        </>
      )}
    </div>
  );
}
function PreferenceProbe() {
  return <p>{useReducedMotion() ? 'reduced' : 'animated'}</p>;
}
it('responds to preference changes and cleans up media listeners', () => {
  const view = render(<PreferenceProbe />);
  expect(screen.getByText('reduced')).toBeInTheDocument();
  act(() => mediaListeners.forEach((listener) => listener({ matches: false })));
  expect(screen.getByText('animated')).toBeInTheDocument();
  view.unmount();
  expect(mediaListeners.size).toBe(0);
});
it('uses a safe reduced-motion default when matchMedia is unavailable', () => {
  window.matchMedia = undefined;
  render(<PreferenceProbe />);
  expect(screen.getByText('reduced')).toBeInTheDocument();
});
it('does not animate when reduced motion is requested', () => {
  gsap.fromTo.mockClear();
  gsap.to.mockClear();
  render(<MotionProbe />);
  expect(gsap.fromTo).not.toHaveBeenCalled();
  expect(gsap.to).not.toHaveBeenCalled();
});
it('animates sections and artwork, updates by route, and handles missing scope/artwork', () => {
  setMotion(false);
  gsap.fromTo.mockClear();
  gsap.to.mockClear();
  const view = render(<MotionProbe />);
  expect(gsap.fromTo).toHaveBeenCalledWith(
    expect.any(HTMLElement),
    expect.objectContaining({ y: 32 }),
    expect.objectContaining({ scrollTrigger: expect.objectContaining({ once: true }) }),
  );
  expect(gsap.to).toHaveBeenCalledTimes(1);
  view.rerender(<MotionProbe artwork={false} identity="other" />);
  expect(gsap.to).toHaveBeenCalledTimes(1);
  view.unmount();
  render(<MotionProbe attached={false} />);
  expect(gsap.fromTo).toHaveBeenCalledTimes(2);
});

it('adds bounded scroll parallax to large photos only and skips empty frames', () => {
  setMotion(false);
  gsap.fromTo.mockClear();
  render(<MotionProbe artwork={false} photos />);
  const photos = [screen.getByAltText('Panorama'), screen.getByAltText('Editorial')];
  for (const photo of photos) {
    expect(gsap.fromTo).toHaveBeenCalledWith(
      photo,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: photo.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      },
    );
  }
  expect(
    gsap.fromTo.mock.calls.some(([element]) => element === screen.getByAltText('Thumbnail')),
  ).toBe(false);
  expect(
    gsap.fromTo.mock.calls.some(([element]) => element === screen.getByText('Fixed caption')),
  ).toBe(false);
  expect(gsap.fromTo).toHaveBeenCalledTimes(3);
});
it('keeps large photos still with reduced motion or missing media API', () => {
  gsap.fromTo.mockClear();
  gsap.to.mockClear();
  const view = render(<MotionProbe photos />);
  expect(gsap.fromTo).not.toHaveBeenCalled();
  expect(gsap.to).not.toHaveBeenCalled();
  view.unmount();
  window.matchMedia = undefined;
  render(<MotionProbe photos />);
  expect(gsap.fromTo).not.toHaveBeenCalled();
});
it('reinitializes photos on route changes and responds to motion preference changes', () => {
  setMotion(false);
  gsap.fromTo.mockClear();
  const view = render(<MotionProbe artwork={false} photos />);
  expect(gsap.fromTo).toHaveBeenCalledTimes(3);
  view.rerender(<MotionProbe artwork={false} photos identity="news-detail" />);
  expect(gsap.fromTo).toHaveBeenCalledTimes(6);
  act(() => mediaListeners.forEach((listener) => listener({ matches: true })));
  expect(gsap.fromTo).toHaveBeenCalledTimes(6);
  act(() => mediaListeners.forEach((listener) => listener({ matches: false })));
  expect(gsap.fromTo).toHaveBeenCalledTimes(9);
  view.unmount();
  expect(mediaListeners.size).toBe(0);
});
