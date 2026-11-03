import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { countries, countryPages } from '../data/site';
import { languageConfig } from '../config/languages';
import { routePath, saveLanguage } from '../lib/navigation';
import { Logo, Arrow } from './Icons';
import ThemeSelect from './ThemeSelect';
import CountryFlag from './CountryFlag';
export default function Layout({ route, children }) {
  const { language, country } = route;
  const { t } = useTranslation();
  const [menu, setMenu] = useState(false);
  const [countryMenu, setCountryMenu] = useState(false);
  const menuButton = useRef(null);
  const countryButton = useRef(null);
  const header = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setMenu(false);
    setCountryMenu(false);
  }, [location.pathname]);
  useEffect(() => {
    const escape = (event) => {
      if (event.key !== 'Escape') return;
      if (countryMenu) {
        setCountryMenu(false);
        countryButton.current.focus();
      } else if (menu) {
        setMenu(false);
        menuButton.current.focus();
      }
    };
    const outside = (event) => {
      if (!header.current.contains(event.target)) setCountryMenu(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, [menu, countryMenu]);
  const links = [
    [country ? 'quienes-somos' : 'nosotros', 'nav.about'],
    ['servicios', 'nav.services'],
    [country ? 'productos' : 'presencia-regional', country ? 'pages.productos' : 'nav.presence'],
    ['novedades', 'nav.news'],
  ];
  function changeLanguage(next) {
    saveLanguage(next);
    const parts = location.pathname.split('/');
    parts[1] = next;
    navigate(parts.join('/') + location.search);
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content').focus();
        }}
      >
        {t('nav.skip')}
      </a>
      <header className="site-header" ref={header}>
        <Link
          to={routePath(language, country)}
          className="brand"
          aria-label={`PoC · ${country ? country.name : t('regional')}`}
        >
          <Logo />
          <span className="brand-location">{country ? country.name : t('regional')}</span>
        </Link>
        <button
          ref={menuButton}
          className="mobile-toggle"
          aria-label={t(menu ? 'nav.close' : 'nav.menu')}
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => {
            setMenu(!menu);
            setCountryMenu(false);
          }}
        >
          <span />
          <span />
        </button>
        <nav
          id="main-navigation"
          className={`main-nav ${menu ? 'is-open' : ''}`}
          aria-label={t('nav.menu')}
        >
          {links.map(([page, key]) => (
            <NavLink key={page} to={routePath(language, country, page)}>
              {t(key)}
            </NavLink>
          ))}
          <Link className="nav-contact" to={routePath(language, country, 'contacto')}>
            {t('nav.contact')} <Arrow diagonal />
          </Link>
        </nav>
        <div className="header-tools">
          <div className="country-switcher">
            <button
              ref={countryButton}
              className="country-trigger"
              aria-expanded={countryMenu}
              aria-controls="country-navigation"
              onClick={() => {
                setCountryMenu(!countryMenu);
                setMenu(false);
              }}
            >
              {country ? (
                <span className="country-code">
                  <CountryFlag code={country.code} />
                  {country.code}
                </span>
              ) : (
                t('nav.countries')
              )}{' '}
              <span aria-hidden="true">⌄</span>
            </button>
            {countryMenu && (
              <nav
                id="country-navigation"
                className="country-dropdown"
                aria-label={t('nav.countries')}
              >
                <Link to={routePath(language)}>{t('nav.corporate')}</Link>
                {countries.map((item) => (
                  <Link key={item.code} to={routePath(language, item)}>
                    {item.name}
                    <span className="country-code">
                      <CountryFlag code={item.code} />
                      {item.code}
                    </span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
          <select
            className="language-select"
            aria-label={t('nav.language')}
            value={language}
            onChange={(event) => changeLanguage(event.target.value)}
          >
            {languageConfig.supportedLanguages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code.toUpperCase()}
              </option>
            ))}
          </select>
          <ThemeSelect />
        </div>
      </header>
      {country && (
        <div className="local-strip">
          <Link to={routePath(language)}>{t('nav.corporate')}</Link>
          <span>/</span>
          <span>{country.name}</span>
          <span className="local-strip-end">{t('regionLabel')}</span>
        </div>
      )}
      {children}
      <footer className="site-footer">
        <div className="footer-top">
          <Link to={routePath(language)} aria-label={t('nav.corporate')}>
            <Logo />
          </Link>
          <p>{t('nav.footer')}</p>
          <Link
            className="circle-link"
            to={routePath(language, country, 'contacto')}
            aria-label={t('nav.contact')}
          >
            <Arrow diagonal />
          </Link>
        </div>
        <div className="footer-links">
          <div>
            <span className="eyebrow">{t('nav.countries')}</span>
            {countries.map((item) => (
              <Link key={item.code} to={routePath(language, item)}>
                {item.name}
              </Link>
            ))}
          </div>
          <div>
            <span className="eyebrow">{country ? country.name : t('regional')}</span>
            {(country
              ? countryPages.slice(1)
              : ['nosotros', 'servicios', 'infraestructura', 'aliados', 'novedades', 'contacto']
            ).map((page) => (
              <Link key={page} to={routePath(language, country, page)}>
                {t(`pages.${page}`)}
              </Link>
            ))}
          </div>
          <div className="footer-statement">
            <span className="eyebrow">{t('legal.demo')}</span>
            <p>{t('hero.orbit')}</p>
            <span>GT · SV · HN · NI · CR · PA</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {t('legal.copyright')}</span>
          <div>
            <Link to={routePath(language, null, 'privacidad')}>{t('legal.privacyLink')}</Link>
            <Link to={routePath(language, null, 'terminos')}>{t('legal.termsLink')}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
