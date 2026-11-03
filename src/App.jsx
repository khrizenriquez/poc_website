import { useLayoutEffect, useRef } from 'react';
import { HashRouter, Link, Navigate, useLocation } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { i18n } from './i18n';
import { readLanguage, resolveRoute, routePath } from './lib/navigation';
import { editorialPages, formPages } from './data/site';
import Layout from './components/Layout';
import { ThemeProvider } from './theme/ThemeProvider';
import Region from './components/Region';
import { usePageMotion } from './components/Motion';
import Home from './pages/Home';
import Editorial, { PageHeading } from './pages/Editorial';
import Catalog from './pages/Catalog';
import DemoForm from './pages/DemoForm';
import News from './pages/News';

export function PageContent({ route }) {
  const { t } = useTranslation();
  const { page, country, language } = route;
  if (page === '') return <Home country={country} language={language} />;
  if (editorialPages.includes(page)) return <Editorial {...route} />;
  if (page === 'presencia-regional')
    return (
      <section className="section-wrap region-page">
        <PageHeading
          title={t('pages.presencia-regional')}
          description={t('region.text')}
          eyebrow={t('region.label')}
        />
        <Region language={language} />
        <p className="map-hint">{t('region.hint')}</p>
      </section>
    );
  if (page === 'productos') return <Catalog country={country} language={language} />;
  if (page === 'novedades') return <News />;
  if (formPages.includes(page)) return <DemoForm page={page} country={country} />;
  if (['privacidad', 'terminos'].includes(page))
    return (
      <section className="section-wrap legal-page">
        <PageHeading title={t(`pages.${page}`)} description={t('legal.demo')} eyebrow="PoC" />
        <p>{t(page === 'privacidad' ? 'legal.privacy' : 'legal.terms')}</p>
      </section>
    );
  return (
    <section className="section-wrap not-found">
      <span className="error-number">404</span>
      <h1>{t('pages.404')}</h1>
      <p>{t('errors.notFound')}</p>
      <Link className="button button-dark" to={routePath(language)}>
        {t('errors.home')}
      </Link>
    </section>
  );
}
function PageRouter() {
  const { t, i18n: instance } = useTranslation();
  const location = useLocation();
  const route = resolveRoute(location.pathname, readLanguage());
  const scope = useRef(null);
  useLayoutEffect(() => {
    instance.changeLanguage(route.language);
    document.documentElement.lang = route.language;
    const countryName = route.country
      ? ` ${instance.t(`countries.${route.country.code}.name`)}`
      : '';
    document.title = `${instance.t(`pages.${route.page || 'home'}`)} · PoC${countryName}`;
  }, [route.language, route.page, route.country, instance]);
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [location.pathname, location.search]);
  usePageMotion(scope, location.pathname + location.search);
  if (location.pathname !== route.canonical)
    return <Navigate replace to={route.canonical + location.search} />;
  return (
    <Layout route={route}>
      <main
        ref={scope}
        id="main-content"
        tabIndex={-1}
        aria-label={t(`pages.${route.page || 'home'}`)}
      >
        <PageContent key={route.country?.code + route.page} route={route} />
      </main>
    </Layout>
  );
}
export function RoutedApp() {
  return (
    <ThemeProvider>
      <PageRouter />
    </ThemeProvider>
  );
}
export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HashRouter>
        <RoutedApp />
      </HashRouter>
    </I18nextProvider>
  );
}
