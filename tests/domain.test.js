import { describe, expect, it, vi } from 'vitest';
import {
  asset,
  isLanguage,
  readLanguage,
  resolveRoute,
  routePath,
  saveLanguage,
} from '../src/lib/navigation';
import { languageConfig } from '../src/config/languages';
import { countries, routeManifest, products, formPages } from '../src/data/site';
import { filterProducts, normalize } from '../src/lib/catalog';
import { initialForm, validateForm } from '../src/lib/forms';
import { createI18n, resources } from '../src/i18n';

describe('routing, locale and persistence', () => {
  it('contains 82 unique content routes plus the 404 view, all localized', () => {
    expect(routeManifest).toHaveLength(82);
    expect(
      new Set(routeManifest.map((route) => routePath('es', route.country, route.page))).size,
    ).toBe(82);
    for (const language of ['es', 'en'])
      for (const route of routeManifest) {
        const path = routePath(language, route.country, route.page);
        expect(resolveRoute(path)).toMatchObject({
          ...route,
          language,
          notFound: false,
          canonical: path,
        });
      }
  });
  it.each([
    ['/', 'es', '/es/', 'es', false],
    ['/', 'en', '/en/', 'en', false],
    ['/', 'invalid', '/es/', 'es', false],
    ['/guatemala', 'en', '/en/guatemala/', 'en', false],
    ['/es/guatemala/productos/', 'en', '/es/guatemala/productos/', 'es', false],
    ['/en/guatemala/productos', 'es', '/en/guatemala/productos/', 'en', false],
    ['/fr/guatemala/', 'en', '/es/guatemala/', 'es', false],
    ['/es//servicios//', 'en', '/es/servicios/', 'es', false],
    ['/fr/missing/', 'en', '/es/missing/', 'es', true],
    ['/es/guatemala/infraestructura/', 'es', '/es/guatemala/infraestructura/', 'es', true],
    ['/es/missing/', 'es', '/es/missing/', 'es', true],
    ['/es/%E0%A4%A', 'en', '/es/%E0%A4%A', 'es', true],
  ])(
    '%s with preference %s resolves canonically',
    (path, preference, canonical, language, notFound) => {
      expect(resolveRoute(path, preference)).toMatchObject({ canonical, language, notFound });
    },
  );
  it('defaults to Spanish, validates preferences and survives blocked storage', () => {
    expect(readLanguage()).toBe('es');
    expect(saveLanguage('fr')).toBe(false);
    expect(saveLanguage('en')).toBe(true);
    expect(readLanguage()).toBe('en');
    localStorage.setItem(languageConfig.storageKey, '<script>');
    expect(readLanguage()).toBe('es');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full');
    });
    expect(readLanguage()).toBe('es');
    expect(saveLanguage('en')).toBe(false);
    expect(isLanguage(undefined)).toBe(false);
    expect(asset('people-team.jpg')).toBe('/poc_website/media/people-team.jpg');
  });
  it('keeps identical translation keys, no empty copy and Spanish fallback', () => {
    function keys(value, prefix = '') {
      return Object.entries(value).flatMap(([key, text]) =>
        typeof text === 'object' ? keys(text, `${prefix}${key}.`) : [`${prefix}${key}`],
      );
    }
    expect(keys(resources.es.translation)).toEqual(keys(resources.en.translation));
    for (const language of ['es', 'en']) {
      const instance = createI18n(language);
      for (const key of keys(resources[language].translation))
        expect(instance.t(key).trim()).not.toBe('');
      expect(instance.t('products.result', { count: 1 })).not.toEqual(
        instance.t('products.result', { count: 2 }),
      );
    }
    const instance = createI18n('en');
    instance.addResource('es', 'translation', 'fallbackOnly', 'Respaldo');
    expect(instance.t('fallbackOnly')).toBe('Respaldo');
    expect(createI18n().language).toBe('es');
  });
  it.each(['/', '/poc_website/', '/another-demo/'])(
    'builds local asset URLs under %s without dropping or duplicating the prefix',
    (base) => {
      vi.stubEnv('BASE_URL', base);
      try {
        expect(asset('people-team.jpg')).toBe(`${base}media/people-team.jpg`);
        expect(asset('flags/gt.svg')).toBe(`${base}media/flags/gt.svg`);
      } finally {
        vi.unstubAllEnvs();
      }
    },
  );
});

describe('catalog filtering', () => {
  const t = createI18n().t;
  it('handles accent/case/whitespace, IDs, categories and empty matches', () => {
    expect(normalize('  NUTRICIÓN  ')).toBe('nutricion');
    expect(filterProducts(products, '', 'all', t)).toHaveLength(6);
    expect(filterProducts(products, '  P01 ', 'all', t)).toEqual([products[0]]);
    expect(filterProducts(products, 'NUTRICION', 'nutrition', t)).toHaveLength(2);
    expect(filterProducts(products, '', 'care', t)).toHaveLength(2);
    expect(filterProducts(products, 'P01', 'care', t)).toEqual([]);
    expect(filterProducts(products, 'not-found', 'all', t)).toEqual([]);
    expect(filterProducts([], '', 'all', t)).toEqual([]);
    expect(filterProducts(products, '', 'invalid', t)).toEqual([]);
    expect(filterProducts(products, 'Skin', 'all', createI18n('en').t)).toEqual([products[1]]);
  });
});

describe('form business rules, including limits and invalid input', () => {
  const valid = {
    ...initialForm,
    name: 'Demo User',
    email: 'demo@example.com',
    message: 'A fictional example with enough characters.',
    consent: true,
    reference: 'P01',
  };
  it.each(formPages)('accepts a valid simulation for %s', (page) =>
    expect(validateForm(valid, page)).toEqual({}),
  );
  it('rejects empty values and whitespace, without mutating the input', () => {
    expect(validateForm(initialForm, 'contacto')).toEqual({
      name: 'name',
      email: 'email',
      message: 'message',
      consent: 'consent',
    });
    expect(
      validateForm({ ...valid, name: '  ', message: ' '.repeat(30) }, 'contacto'),
    ).toMatchObject({ name: 'name', message: 'message' });
    expect(initialForm.name).toBe('');
  });
  it.each(['', 'x', 'a'.repeat(81)])('rejects name length %s', (name) =>
    expect(validateForm({ ...valid, name }, 'contacto').name).toBe('name'),
  );
  it.each(['x@', 'x@y', 'x y@z.co', 'x'.repeat(155) + '@a.com'])(
    'rejects malformed/oversized email %s',
    (email) => expect(validateForm({ ...valid, email }, 'contacto').email).toBe('email'),
  );
  it.each(['', 'a'.repeat(19), 'a'.repeat(1501)])('rejects message boundaries', (message) =>
    expect(validateForm({ ...valid, message }, 'contacto').message).toBe('message'),
  );
  it('accepts exact inclusive text boundaries and trims fields', () => {
    for (const name of ['ab', 'a'.repeat(80)])
      for (const message of ['a'.repeat(20), 'a'.repeat(1500)]) {
        expect(validateForm({ ...valid, name, message }, 'contacto')).toEqual({});
      }
    expect(
      validateForm({ ...valid, name: '  ab  ', email: ' demo@example.com ' }, 'contacto'),
    ).toEqual({});
    expect(validateForm({ ...valid, email: 'a'.repeat(154) + '@a.com' }, 'contacto')).toEqual({});
  });
  it.each(['0', '101', '1.2', '-1', '', '1e2', 'abc'])('rejects quantity %s', (quantity) =>
    expect(validateForm({ ...valid, quantity }, 'pedidos').quantity).toBe('quantity'),
  );
  it.each(['1', '100'])('accepts quantity %s', (quantity) =>
    expect(validateForm({ ...valid, quantity }, 'pedidos')).toEqual({}),
  );
  it.each(['pedidos', 'devoluciones'])('rejects nonexistent product for %s', (page) => {
    expect(validateForm({ ...valid, reference: 'P99' }, page).reference).toBe('reference');
    expect(validateForm({ ...valid, reference: '' }, page).reference).toBe('reference');
  });
  it('allows anonymous ethics reports only, still requiring message and consent', () => {
    const anonymous = { ...valid, name: '', email: '', anonymous: true };
    expect(validateForm(anonymous, 'etica-y-denuncias')).toEqual({});
    expect(
      validateForm({ ...anonymous, consent: false, message: '' }, 'etica-y-denuncias'),
    ).toEqual({ message: 'message', consent: 'consent' });
    expect(validateForm(anonymous, 'contacto')).toMatchObject({ name: 'name', email: 'email' });
  });
});
