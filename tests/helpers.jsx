import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { createI18n } from '../src/i18n';
import { RoutedApp } from '../src/App';
export function renderPage(path = '/es/', language = 'es') {
  const instance = createI18n(language);
  return {
    instance,
    ...render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter initialEntries={[path]}>
          <RoutedApp />
        </MemoryRouter>
      </I18nextProvider>,
    ),
  };
}
export function renderWithLanguage(element, language = 'es') {
  const instance = createI18n(language);
  return {
    instance,
    ...render(
      <I18nextProvider i18n={instance}>
        <MemoryRouter>{element}</MemoryRouter>
      </I18nextProvider>,
    ),
  };
}
