import { act, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderPage } from './helpers';
import { languageConfig } from '../src/config/languages';

it('navigates corporate → country → catalog → another country and back', async () => {
  const user = userEvent.setup();
  renderPage();
  await user.click(screen.getByRole('link', { name: 'Explora nuestra red' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Seis países');
  await user.click(screen.getAllByRole('link', { name: 'Visitar PoC Guatemala' })[0]);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Guatemala');
  await user.click(
    within(screen.getByRole('navigation', { name: 'Abrir menú' })).getByRole('link', {
      name: 'Un portafolio de posibilidades',
    }),
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Un portafolio');
  await user.click(screen.getByRole('button', { name: 'GT' }));
  await user.click(
    within(screen.getByRole('navigation', { name: 'Países' })).getByRole('link', {
      name: 'Costa Rica CR',
    }),
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Costa Rica');
  await user.click(screen.getAllByRole('link', { name: 'Sitio corporativo' })[0]);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Conectamos');
});

it('switches languages preserving country, page and query, and saves only the preference', async () => {
  renderPage('/es/guatemala/novedades/?story=quality');
  fireEvent.change(screen.getByRole('combobox', { name: 'Idioma' }), { target: { value: 'en' } });
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Care is in the details' }),
  ).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('en');
  expect(screen.getByLabelText('PoC · Guatemala')).toBeInTheDocument();
  expect(localStorage.getItem(languageConfig.storageKey)).toBe('en');
  expect(localStorage.length).toBe(1);
});
it('survives disabled localStorage while changing language', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw Error('blocked');
  });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('blocked');
  });
  renderPage('/es/guatemala/servicios/');
  fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } });
  expect(
    await screen.findByRole('heading', { level: 1, name: 'The value of every connection' }),
  ).toBeInTheDocument();
});
it('restores preference on a bare URL and lets an explicit URL override it', () => {
  localStorage.setItem(languageConfig.storageKey, 'en');
  const view = renderPage('/guatemala');
  expect(document.documentElement.lang).toBe('en');
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Guatemala');
  view.unmount();
  renderPage('/es/guatemala');
  expect(document.documentElement.lang).toBe('es');
});
it.each(['/es/missing/', '/fr/missing/', '/es/%E0%A4%A'])(
  'recovers from unknown/malformed route %s',
  async (path) => {
    renderPage(path);
    expect(screen.getByText('404')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('link', { name: 'Volver al inicio' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Conectamos');
  },
);
it('normalizes an unsupported locale to Spanish', () => {
  renderPage('/fr/guatemala/');
  expect(document.documentElement.lang).toBe('es');
});
it('supports mobile menu, Escape, outside clicks and skip link focus', async () => {
  const user = userEvent.setup();
  renderPage();
  const menu = screen.getByRole('button', { name: 'Abrir menú' });
  await user.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard('{Escape}');
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(menu).toHaveFocus();
  const countries = screen.getByRole('button', { name: 'Países' });
  await user.click(countries);
  await user.keyboard('{Escape}');
  expect(countries).toHaveFocus();
  await user.click(countries);
  await user.click(screen.getByRole('heading', { level: 1 }));
  expect(countries).toHaveAttribute('aria-expanded', 'false');
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('link', { name: 'Saltar al contenido' }));
  expect(screen.getByRole('main')).toHaveFocus();
});
it('filters catalog, handles no results and resets', async () => {
  const user = userEvent.setup();
  renderPage('/es/guatemala/productos/');
  expect(screen.getByRole('status')).toHaveTextContent('6 resultados');
  await user.selectOptions(screen.getByLabelText('Categoría'), 'nutrition');
  expect(screen.getByRole('status')).toHaveTextContent('2 resultados');
  fireEvent.change(screen.getByLabelText('Buscar por nombre o código'), {
    target: { value: 'inexistente' },
  });
  expect(screen.getByText('No encontramos coincidencias.')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('status')).toHaveTextContent('6 resultados');
  fireEvent.change(screen.getByLabelText('Buscar por nombre o código'), {
    target: { value: 'p01' },
  });
  expect(screen.getByRole('status')).toHaveTextContent('1 resultado');
});
it('opens product details, traps focus, closes by Escape/backdrop/button and restores focus', async () => {
  const user = userEvent.setup();
  renderPage('/es/guatemala/productos/');
  const open = screen.getByRole('button', { name: 'Ver detalle: Bienestar diario' });
  await user.click(open);
  const dialog = screen.getByRole('dialog');
  const close = within(dialog).getByRole('button', { name: 'Cerrar detalle' });
  expect(close).toHaveFocus();
  await user.tab({ shift: true });
  expect(within(dialog).getByRole('link')).toHaveFocus();
  await user.tab();
  expect(close).toHaveFocus();
  await user.tab();
  expect(within(dialog).getByRole('link')).toHaveFocus();
  await user.click(within(dialog).getByRole('heading'));
  expect(dialog).toBeInTheDocument();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(open).toHaveFocus();
  expect(document.body.style.overflow).toBe('');
  await user.click(open);
  fireEvent.click(screen.getByRole('dialog').parentElement);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await user.click(open);
  await user.click(screen.getByRole('button', { name: 'Cerrar detalle' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
it('starts an order from a product and preserves the selected reference', async () => {
  const user = userEvent.setup();
  renderPage('/es/guatemala/productos/');
  await user.click(screen.getByRole('button', { name: 'Ver detalle: Bienestar diario' }));
  await user.click(screen.getByRole('link', { name: 'Simular pedido' }));
  expect(screen.getByLabelText('Referencia de producto')).toHaveValue('P01');
});
it('shows news detail, returns to list and handles an unknown story', async () => {
  renderPage('/es/novedades/?story=missing');
  expect(screen.getAllByRole('button', { name: 'Leer historia' })).toHaveLength(3);
  await userEvent.click(screen.getAllByRole('button', { name: 'Leer historia' })[0]);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Una región conectada');
  await userEvent.click(screen.getByRole('button', { name: 'Volver a las historias' }));
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lo que nos mueve');
});
function fillValid() {
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Demo User' } });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'demo@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Cuéntanos más/), {
    target: { value: 'Esta es una consulta ficticia de demostración.' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: /Entiendo/ }));
}
it('validates empty form, focuses first error, clears errors on correction, simulates and resets', async () => {
  const fetch = vi.spyOn(globalThis, 'fetch');
  renderPage('/es/contacto/');
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos');
  expect(screen.getByLabelText(/Nombre/)).toHaveFocus();
  expect(screen.getByText('Escribe entre 2 y 80 caracteres.')).toBeInTheDocument();
  fillValid();
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByRole('status')).toHaveTextContent('Simulación completada');
  expect(screen.getByRole('status')).toHaveFocus();
  expect(fetch).not.toHaveBeenCalled();
  expect(localStorage.length).toBe(0);
  await userEvent.click(screen.getByRole('button', { name: 'Crear otra simulación' }));
  expect(screen.getByLabelText('Nombre')).toHaveValue('');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
it('rejects malformed email, short message, missing consent, reference and quantity; recovers', async () => {
  renderPage('/es/guatemala/pedidos/?product=bad');
  expect(screen.getByLabelText('Referencia de producto')).toHaveValue('');
  fillValid();
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'bad' } });
  fireEvent.change(screen.getByLabelText(/Cuéntanos más/), { target: { value: 'short' } });
  fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('checkbox', { name: /Entiendo/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByText('Escribe un correo válido de hasta 160 caracteres.')).toBeInTheDocument();
  expect(screen.getByText('Escribe entre 20 y 1500 caracteres.')).toBeInTheDocument();
  expect(
    screen.getByText('Selecciona una referencia válida del catálogo de ejemplo.'),
  ).toBeInTheDocument();
  expect(screen.getByText('Escribe un número entero entre 1 y 100.')).toBeInTheDocument();
  expect(screen.getByText('Confirma que entiendes el modo demostración.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'demo@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Cuéntanos más/), {
    target: { value: 'Consulta ficticia de prueba suficientemente larga.' },
  });
  fireEvent.change(screen.getByLabelText('Referencia de producto'), { target: { value: 'P02' } });
  fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '100' } });
  fireEvent.click(screen.getByRole('checkbox', { name: /Entiendo/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByRole('status')).toHaveTextContent('Simulación completada');
});
it('supports anonymous reporting and removes identity errors, without exempting consent', async () => {
  renderPage('/es/guatemala/etica-y-denuncias/');
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  fireEvent.click(screen.getByRole('checkbox', { name: /anónima/ }));
  expect(screen.queryByLabelText('Nombre')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/Cuéntanos más/), {
    target: { value: 'Un reporte completamente ficticio para esta prueba.' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: /Entiendo/ }));
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByRole('status')).toHaveTextContent('Simulación completada');
});
it('clears form data on page/country navigation', async () => {
  renderPage('/es/guatemala/contacto/');
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Demo' } });
  await userEvent.click(screen.getByRole('link', { name: 'Estamos para orientarte' }));
  expect(screen.getByLabelText('Nombre')).toHaveValue('');
});
