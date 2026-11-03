import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { renderWithLanguage } from './helpers';
import HeroArt, { SceneBoundary, StaticNetwork, supportsWebGL } from '../src/components/HeroArt';
import { setMotion } from './setup';
const scene = vi.hoisted(() => ({ onLost: null, fail: false }));
vi.mock('../src/components/NetworkScene', () => ({
  default: ({ onLost }) => {
    scene.onLost = onLost;
    if (scene.fail) throw Error('WebGL failure');
    return <div data-testid="canvas-scene">Scene</div>;
  },
}));
it('detects unavailable and throwing WebGL contexts', () => {
  expect(supportsWebGL()).toBe(false);
  HTMLCanvasElement.prototype.getContext.mockImplementation(() => {
    throw Error('disabled');
  });
  expect(supportsWebGL()).toBe(false);
});
it('renders SVG fallback with unavailable WebGL and reduced motion', () => {
  const first = renderWithLanguage(<HeroArt />);
  expect(first.container.querySelector('.static-network')).toBeInTheDocument();
  first.unmount();
  HTMLCanvasElement.prototype.getContext.mockReturnValue({});
  const second = renderWithLanguage(<HeroArt />);
  expect(second.container.querySelector('.static-network')).toBeInTheDocument();
  expect(screen.queryByTestId('canvas-scene')).not.toBeInTheDocument();
});
it('loads 3D progressively and recovers from context loss', async () => {
  setMotion(false);
  HTMLCanvasElement.prototype.getContext.mockReturnValue({});
  const view = renderWithLanguage(<HeroArt />);
  expect(await screen.findByTestId('canvas-scene')).toBeInTheDocument();
  act(() => scene.onLost());
  expect(screen.queryByTestId('canvas-scene')).not.toBeInTheDocument();
  expect(view.container.querySelector('.static-network')).toBeInTheDocument();
});
it('recovers from thrown render errors with the static scene', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  function Broken() {
    throw Error('intentional render failure');
  }
  const view = render(
    <SceneBoundary fallback={<StaticNetwork />}>
      <Broken />
    </SceneBoundary>,
  );
  expect(view.container.querySelector('.static-network')).toBeInTheDocument();
  expect(consoleError).toHaveBeenCalled();
});
