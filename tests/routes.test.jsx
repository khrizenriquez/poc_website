import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { routeManifest } from '../src/data/site';
import { routePath } from '../src/lib/navigation';
import { renderPage } from './helpers';

describe.each(['light', 'dark'])('Theme %s', (theme) => {
  describe.each(['es', 'en'])('All routes in %s', (language) => {
    it.each(routeManifest.map((route) => [routePath(language, route.country, route.page), route]))(
      '%s renders its own content and localized title',
      (path, route) => {
        localStorage.setItem('leterago-poc.theme', theme);
        const { instance } = renderPage(path, language);
        expect(document.documentElement).toHaveAttribute('data-theme', theme);
        expect(screen.getByRole('contentinfo')).toHaveTextContent(
          '© 2026 PoC - Christofer Enríquez',
        );
        expect(document.body).not.toHaveTextContent(/leterago/i);
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
        expect(document.documentElement.lang).toBe(language);
        expect(document.title).toContain(instance.t(`pages.${route.page || 'home'}`));
        expect(screen.queryByText('404')).not.toBeInTheDocument();
        expect(screen.getByLabelText(instance.t('nav.language'))).toHaveValue(language);
        if (route.country)
          expect(screen.getByLabelText(`PoC · ${route.country.name}`)).toBeInTheDocument();
      },
    );
  });
});
