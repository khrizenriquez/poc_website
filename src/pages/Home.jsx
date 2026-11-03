import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroArt from '../components/HeroArt';
import Region from '../components/Region';
import { Arrow } from '../components/Icons';
import { articles, services } from '../data/site';
import { asset, routePath } from '../lib/navigation';
const images = ['logistics-person.jpg', 'distribution-center.jpg', 'people-team.jpg'];
export default function Home({ language, country }) {
  const { t } = useTranslation();
  return (
    <>
      <section className={`hero ${country ? 'country-hero' : ''}`}>
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" />
            {t(country ? 'hero.localEyebrow' : 'hero.eyebrow')}
          </span>
          <h1>
            {t(country ? 'hero.localTitle' : 'hero.line1')}
            <br />
            <span>{country ? t(`countries.${country.code}.name`) : t('hero.line2')}</span>
          </h1>
          <p>
            {country
              ? t('hero.localDescription', { country: t(`countries.${country.code}.name`) })
              : t('hero.description')}
          </p>
          <Link
            className="button button-dark"
            to={
              country
                ? routePath(language, country, 'servicios')
                : routePath(language, null, 'presencia-regional')
            }
          >
            {t(country ? 'hero.localCta' : 'hero.cta')}
            <Arrow diagonal />
          </Link>
        </div>
        {country ? (
          <div className="country-hero-photo" data-parallax>
            <img
              src={asset('logistics-person.jpg')}
              alt={t('editorial.galleryCaption')}
              fetchPriority="high"
            />
            <span className="photo-country">
              {country.code}
              <small>{t(`countries.${country.code}.name`)}</small>
            </span>
          </div>
        ) : (
          <HeroArt />
        )}
        <div className="hero-bottom">
          <span>
            <span className="scroll-line" />
            {t('hero.scroll')}
          </span>
          <span>{country ? t('hero.localNote') : t('hero.coordinates')}</span>
        </div>
      </section>
      <section className="intro-section section-wrap" data-reveal>
        <div>
          <span className="eyebrow">{t('home.introLabel')}</span>
          <h2>{t('home.introTitle')}</h2>
        </div>
        <div className="intro-body">
          <p>{t('home.introText')}</p>
          <Link
            className="text-link"
            to={routePath(language, country, country ? 'quienes-somos' : 'nosotros')}
          >
            {t('home.introLink')}
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <figure className="panorama" data-parallax>
        <img
          src={asset('distribution-center.jpg')}
          alt={t('editorial.galleryCaption')}
          loading="lazy"
        />
        <figcaption>
          <span>{t('hero.orbit')}</span>
          <span>{t('editorial.galleryCaption')}</span>
        </figcaption>
      </figure>
      <section className="services-section section-wrap">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">{t('home.servicesLabel')}</span>
          <h2>{t('home.servicesTitle')}</h2>
          <p>{t('home.servicesText')}</p>
        </div>
        <div className="service-cards">
          {services.map((service, index) => (
            <Link
              className="service-card"
              key={service}
              to={routePath(language, country, 'servicios')}
              data-reveal
            >
              <div className="service-image">
                <img
                  src={asset(images[index])}
                  alt={t(`services.${service}.title`)}
                  loading="lazy"
                />
                <span>0{index + 1}</span>
              </div>
              <div className="service-card-title">
                <h3>{t(`services.${service}.title`)}</h3>
                <Arrow diagonal />
              </div>
              <p>{t(`services.${service}.text`)}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="regional-section section-wrap">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">{t('home.regionalLabel')}</span>
          <h2>{t('home.regionalTitle')}</h2>
          <p>{t('home.regionalText')}</p>
        </div>
        <Region language={language} />
      </section>
      <section className="news-section section-wrap">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">{t('home.newsLabel')}</span>
          <h2>{t('home.newsTitle')}</h2>
          <Link className="text-link" to={routePath(language, country, 'novedades')}>
            {t('nav.all')}
            <Arrow />
          </Link>
        </div>
        <div className="news-grid">
          {articles.map((article) => (
            <Link
              className="news-card"
              key={article.id}
              to={`${routePath(language, country, 'novedades')}?story=${article.id}`}
            >
              <img src={asset(article.image)} alt={t('editorial.galleryCaption')} loading="lazy" />
              <span className="eyebrow">{t(`news.${article.id}.category`)}</span>
              <h3>{t(`news.${article.id}.title`)}</h3>
              <span className="text-link">
                {t('news.read')}
                <Arrow diagonal />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="closing-section" data-reveal>
        <span className="eyebrow">PoC / {t('regional')}</span>
        <h2>{t('home.quote')}</h2>
        <Link className="button button-light" to={routePath(language, country, 'contacto')}>
          {t('home.quoteLink')}
          <Arrow diagonal />
        </Link>
      </section>
    </>
  );
}
