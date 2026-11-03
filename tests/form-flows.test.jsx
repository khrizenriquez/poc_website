import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderPage } from './helpers';
import { formPages } from '../src/data/site';

describe.each(['light', 'dark'])('Form theme %s', (theme) => {
  describe.each(['es', 'en'])('Complete form scenarios in %s', (language) => {
    it.each(formPages)(
      '%s rejects missing input, then completes without sending data',
      async (page) => {
        localStorage.setItem('leterago-poc.theme', theme);
        const { instance } = renderPage(`/${language}/nicaragua/${page}/`, language);
        const t = instance.t;
        const fetch = vi.spyOn(globalThis, 'fetch');
        const send = vi.spyOn(XMLHttpRequest.prototype, 'send');
        await userEvent.click(screen.getByRole('button', { name: t('forms.submit') }));
        expect(screen.getByRole('alert')).toHaveTextContent(t('forms.summary'));
        expect(screen.getByLabelText(t('forms.name'))).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(screen.getByLabelText(t('forms.name')), {
          target: { value: 'Demo User' },
        });
        fireEvent.change(screen.getByLabelText(t('forms.email')), {
          target: { value: 'demo@example.com' },
        });
        fireEvent.change(screen.getByLabelText(t('forms.message')), {
          target: { value: 'A fictional demonstration request for testing.' },
        });
        if (['pedidos', 'devoluciones'].includes(page))
          fireEvent.change(screen.getByLabelText(t('forms.reference')), {
            target: { value: 'P03' },
          });
        if (page === 'pedidos')
          fireEvent.change(screen.getByLabelText(t('forms.quantity')), { target: { value: '2' } });
        fireEvent.click(screen.getByLabelText(t('forms.consent')));
        await userEvent.click(screen.getByRole('button', { name: t('forms.submit') }));
        expect(screen.getByRole('status')).toHaveTextContent(t('forms.successBody'));
        expect(fetch).not.toHaveBeenCalled();
        expect(send).not.toHaveBeenCalled();
        expect(localStorage.length).toBe(1);
        expect(localStorage.getItem('leterago-poc.theme')).toBe(theme);
        expect(document.documentElement).toHaveAttribute('data-theme', theme);
      },
    );
  });
});
it('preserves draft and translates validation errors when switching language', async () => {
  renderPage('/es/honduras/contacto/');
  fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Demo User' } });
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } });
  expect(screen.getByLabelText('Name')).toHaveValue('Demo User');
  expect(screen.getByText('Enter a valid email of up to 160 characters.')).toBeInTheDocument();
  expect(
    screen.queryByText('Escribe un correo válido de hasta 160 caracteres.'),
  ).not.toBeInTheDocument();
});
it('requires identity again after turning off anonymous mode', async () => {
  renderPage('/es/honduras/etica-y-denuncias/');
  const anonymous = screen.getByLabelText('Prefiero una denuncia anónima de ejemplo');
  fireEvent.click(anonymous);
  fireEvent.click(anonymous);
  await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
  expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
});
