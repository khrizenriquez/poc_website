import { StrictMode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { themeConfig } from '../src/config/theme';
import { normalizeTheme, ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { renderPage } from './helpers';

function systemPreference(dark = false) {
  const listeners = new Set();
  const media = {
    matches: dark,
    addEventListener: vi.fn((_, callback) => listeners.add(callback)),
    removeEventListener: vi.fn((_, callback) => listeners.delete(callback)),
  };
  const previous = window.matchMedia;
  window.matchMedia = vi.fn((query) =>
    query === themeConfig.mediaQuery ? media : previous(query),
  );
  return {
    media,
    listeners,
    change(matches) {
      media.matches = matches;
      act(() => listeners.forEach((callback) => callback({ matches })));
    },
  };
}
function Probe() {
  const { preference, theme, changePreference } = useTheme();
  return (
    <>
      <output>{`${preference}/${theme}`}</output>
      {['light', 'dark', 'system', 'invalid'].map((value) => (
        <button key={value} onClick={() => changePreference(value)}>
          {value}
        </button>
      ))}
    </>
  );
}
function renderTheme() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
}
function assertTheme(theme) {
  expect(document.documentElement).toHaveAttribute('data-theme', theme);
  expect(document.documentElement.style.colorScheme).toBe(theme);
}
function storageChange(key, newValue, storageArea = localStorage) {
  act(() => window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea })));
}

describe('Theme preferences and failures', () => {
  it.each([null, '', 'sepia', 'DARK', 'undefined', '{}', 42])(
    'normalizes invalid preference %s',
    (value) => {
      expect(normalizeTheme(value)).toBe('system');
    },
  );
  it.each(['light', 'dark', 'system'])('accepts %s', (value) => {
    expect(normalizeTheme(value)).toBe(value);
  });
  it.each([false, true])(
    'uses system appearance on first visit (dark=%s) without writing storage',
    (dark) => {
      systemPreference(dark);
      renderTheme();
      assertTheme(dark ? 'dark' : 'light');
      expect(screen.getByRole('status')).toHaveTextContent(`system/${dark ? 'dark' : 'light'}`);
      expect(localStorage.length).toBe(0);
    },
  );
  it.each(['light', 'dark'])('restores %s and ignores conflicting OS changes', (theme) => {
    const os = systemPreference(theme === 'light');
    localStorage.setItem(themeConfig.storageKey, theme);
    renderTheme();
    assertTheme(theme);
    os.change(false);
    os.change(true);
    assertTheme(theme);
  });
  it('falls back from corrupt storage, tracks live system changes, and stops after unmount', () => {
    const os = systemPreference(true);
    localStorage.setItem(themeConfig.storageKey, 'broken');
    const view = renderTheme();
    assertTheme('dark');
    os.change(false);
    assertTheme('light');
    view.unmount();
    expect(os.listeners.size).toBe(0);
    expect(os.media.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
  it('works without matchMedia, including explicit dark mode', () => {
    window.matchMedia = undefined;
    const view = renderTheme();
    assertTheme('light');
    fireEvent.click(screen.getByRole('button', { name: 'dark', exact: true }));
    assertTheme('dark');
    view.unmount();
  });
  it('survives denied reads and quota-exceeded writes', () => {
    systemPreference(true);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    renderTheme();
    assertTheme('dark');
    fireEvent.click(screen.getByRole('button', { name: 'light', exact: true }));
    assertTheme('light');
  });
  it('survives a blocked localStorage property, including storage events', () => {
    const storage = localStorage;
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    renderTheme();
    fireEvent.click(screen.getByRole('button', { name: 'dark', exact: true }));
    storageChange(themeConfig.storageKey, 'light', storage);
    assertTheme('dark');
  });
  it('persists an explicit choice across remount and returns to the latest system preference', () => {
    const os = systemPreference(false);
    const view = renderTheme();
    fireEvent.click(screen.getByRole('button', { name: 'dark', exact: true }));
    expect(localStorage.getItem(themeConfig.storageKey)).toBe('dark');
    view.unmount();
    renderTheme();
    assertTheme('dark');
    os.change(true);
    fireEvent.click(screen.getByRole('button', { name: 'system', exact: true }));
    assertTheme('dark');
    os.change(false);
    assertTheme('light');
    expect(localStorage.getItem(themeConfig.storageKey)).toBe('system');
    fireEvent.click(screen.getByRole('button', { name: 'invalid', exact: true }));
    expect(screen.getByRole('status')).toHaveTextContent('system/light');
  });
  it('syncs other tabs, resets removed/invalid/cleared values, and ignores unrelated/session storage', () => {
    systemPreference(false);
    const view = renderTheme();
    storageChange(themeConfig.storageKey, 'dark');
    assertTheme('dark');
    storageChange('other-key', 'light');
    storageChange(themeConfig.storageKey, 'light', sessionStorage);
    assertTheme('dark');
    storageChange(themeConfig.storageKey, null);
    assertTheme('light');
    storageChange(themeConfig.storageKey, 'dark');
    storageChange(null, null);
    assertTheme('light');
    storageChange(themeConfig.storageKey, 'dark');
    storageChange(themeConfig.storageKey, 'invalid');
    assertTheme('light');
    view.unmount();
    storageChange(themeConfig.storageKey, 'dark');
    assertTheme('light');
  });
  it('updates browser chrome when metadata exists and survives StrictMode remount', () => {
    const os = systemPreference();
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
    const view = render(
      <StrictMode>
        <ThemeProvider>
          <Probe />
        </ThemeProvider>
      </StrictMode>,
    );
    expect(os.listeners.size).toBe(1);
    expect(meta.content).toBe(themeConfig.colors.light);
    fireEvent.click(screen.getByRole('button', { name: 'dark', exact: true }));
    expect(meta.content).toBe(themeConfig.colors.dark);
    view.unmount();
    expect(os.listeners.size).toBe(0);
  });
  it('reports incorrect provider usage', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTheme requires ThemeProvider');
  });
});

describe('Bilingual theme controls throughout the app', () => {
  it.each(['es', 'en'])(
    'exposes labeled native options and persists changes in %s',
    async (language) => {
      const { instance } = renderPage(`/${language}/`, language);
      const select = screen.getByRole('combobox', { name: instance.t('theme.label') });
      expect(select).toHaveValue('system');
      expect([...select.options].map((option) => option.text)).toEqual(
        themeConfig.preferences.map((key) => instance.t(`theme.${key}`)),
      );
      select.focus();
      expect(select).toHaveFocus();
      await userEvent.selectOptions(select, 'dark');
      assertTheme('dark');
      expect(select).toHaveFocus();
      await userEvent.selectOptions(select, 'light');
      assertTheme('light');
      expect(localStorage.getItem(themeConfig.storageKey)).toBe('light');
    },
  );
  it('preserves form drafts, invalid states, product query and locale when theme changes', async () => {
    renderPage('/es/guatemala/pedidos/?product=P01');
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Demo User' } });
    await userEvent.click(screen.getByRole('button', { name: 'Simular envío' }));
    const name = screen.getByLabelText('Nombre');
    fireEvent.change(screen.getByLabelText('Apariencia'), { target: { value: 'dark' } });
    expect(screen.getByLabelText('Nombre')).toBe(name);
    expect(name).toHaveValue('Demo User');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } });
    expect(screen.getByLabelText('Name')).toHaveValue('Demo User');
    expect(screen.getByLabelText('Appearance')).toHaveValue('dark');
    expect(document.title).toContain('Guatemala');
    assertTheme('dark');
    fireEvent.change(screen.getByLabelText('Appearance'), { target: { value: 'light' } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Demo User');
  });
  it('retains in-memory preference on country navigation even when saving is blocked', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    renderPage('/es/');
    fireEvent.change(screen.getByLabelText('Apariencia'), { target: { value: 'dark' } });
    await userEvent.click(screen.getByRole('button', { name: /Países/ }));
    const navigation = document.getElementById('country-navigation');
    await userEvent.click(
      [...navigation.querySelectorAll('a')].find((link) => link.textContent.includes('Panamá')),
    );
    assertTheme('dark');
    expect(screen.getByLabelText('PoC · Panamá')).toBeInTheDocument();
    expect(screen.getByLabelText('Apariencia')).toHaveValue('dark');
  });
  it.each(['light', 'dark'])('keeps %s on canonical redirects and missing pages', (theme) => {
    localStorage.setItem(themeConfig.storageKey, theme);
    renderPage('/es/no-such-page');
    assertTheme(theme);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByLabelText('Apariencia')).toHaveValue(theme);
  });
});

it('keeps catalog filters and open detail on system appearance changes', async () => {
  const os = systemPreference(false);
  renderPage('/es/guatemala/productos/');
  fireEvent.change(screen.getByLabelText('Buscar por nombre o código'), {
    target: { value: 'missing' },
  });
  fireEvent.change(screen.getByLabelText('Apariencia'), { target: { value: 'dark' } });
  expect(screen.getByText('No encontramos coincidencias.')).toBeInTheDocument();
  expect(screen.getByLabelText('Buscar por nombre o código')).toHaveValue('missing');
  await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  fireEvent.change(screen.getByLabelText('Apariencia'), { target: { value: 'system' } });
  await userEvent.click(screen.getByRole('button', { name: 'Ver detalle: Bienestar diario' }));
  const dialog = screen.getByRole('dialog');
  const close = screen.getByRole('button', { name: 'Cerrar detalle' });
  os.change(true);
  assertTheme('dark');
  expect(screen.getByRole('dialog')).toBe(dialog);
  expect(close).toHaveFocus();
  expect(document.body.style.overflow).toBe('hidden');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ver detalle: Bienestar diario' })).toHaveFocus();
});
