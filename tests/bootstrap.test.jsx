import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import App from '../src/App';
const roots = vi.hoisted(() => []);
vi.mock('react-dom/client', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    createRoot: (...args) => {
      const root = original.createRoot(...args);
      roots.push(root);
      return root;
    },
  };
});

it('supports real hash routes, language links and reload-style remounts', async () => {
  window.location.hash = '#/en/panama/productos/';
  const view = render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'A portfolio of possibilities',
  );
  expect(document.documentElement.lang).toBe('en');
  view.unmount();
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'A portfolio of possibilities',
  );
  expect(screen.getByLabelText('PoC · Panama')).toHaveAttribute('href', '#/en/panama/');
});
it('boots the actual entry point with StrictMode', async () => {
  window.location.hash = '#/es/';
  const host = document.createElement('div');
  host.id = 'root';
  document.body.appendChild(host);
  await act(async () => {
    await import('../src/main');
  });
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Conectamos');
  await act(async () => roots.at(-1).unmount());
  host.remove();
});
