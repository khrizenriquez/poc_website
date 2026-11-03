import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import NetworkScene, { NetworkObject, rotateNetwork } from '../src/components/NetworkScene';
const callbacks = vi.hoisted(() => ({ frame: null, created: null }));
vi.mock('@react-three/fiber', () => ({
  useFrame: (callback) => {
    callbacks.frame = callback;
  },
  Canvas: ({ onCreated, children }) => {
    callbacks.created = onCreated;
    return <div>{children}</div>;
  },
}));
it('updates the scene rotation without React state and tolerates an unmounted group', () => {
  rotateNetwork(null, 1);
  const group = { rotation: { y: 0, z: 0 } };
  rotateNetwork(group, 10);
  expect(group.rotation.y).toBeCloseTo(1.2);
  expect(group.rotation.z).toBeCloseTo(Math.sin(1.5) * 0.12);
});
it('builds geometry, drives the animation and handles context loss', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {}); // DOM renderer does not understand Three.js intrinsic elements.
  const lost = vi.fn();
  const view = render(<NetworkScene onLost={lost} />);
  const group = view.container.querySelector('group');
  group.rotation = { y: 0, z: 0 };
  callbacks.frame({ clock: { getElapsedTime: () => 2 } });
  expect(group.rotation.y).toBeCloseTo(0.24);
  const canvas = document.createElement('canvas');
  callbacks.created({ gl: { domElement: canvas } });
  const event = new Event('webglcontextlost', { cancelable: true });
  canvas.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(lost).toHaveBeenCalledTimes(1);
  canvas.dispatchEvent(new Event('webglcontextlost'));
  expect(lost).toHaveBeenCalledTimes(1);
});
