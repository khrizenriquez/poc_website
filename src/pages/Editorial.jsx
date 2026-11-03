import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { asset, routePath } from '../lib/navigation';
import { services } from '../data/site';
import { Arrow } from '../components/Icons';
export function PageHeading({ title, description, eyebrow }) {
  return (
    <div className="page-heading" data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export default function Editorial({ page, country, language }) {
  const { t } = useTranslation();
  const key =
    page === 'infraestructura' ? 'infrastructure' : page === 'aliados' ? 'partners' : 'about';
  return (
    <div className="editorial-page section-wrap">
      <PageHeading
        title={t(`pages.${page}`)}
        description={t('editorial.intro')}
        eyebrow={country ? country.name : t('regional')}
      />
      {page === 'servicios' ? (
        <div className="service-details">
          {services.map((service, index) => (
            <article key={service} data-reveal>
              <span className="row-index">0{index + 1}</span>
              <h2>{t(`services.${service}.title`)}</h2>
              <p>{t(`services.${service}.detail`)}</p>
              <Link className="text-link" to={routePath(language, country, 'contacto')}>
                {t('nav.contact')}
                <Arrow diagonal />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="editorial-body">
          <div className="editorial-photo" data-parallax>
            <img
              src={asset(
                page === 'infraestructura'
                  ? 'distribution-center.jpg'
                  : page === 'aliados'
                    ? 'quality-care.jpg'
                    : 'people-team.jpg',
              )}
              alt={t('editorial.galleryCaption')}
            />
          </div>
          <div>
            <span className="eyebrow">PoC / {t('regional')}</span>
            <h2>{t('hero.orbit')}</h2>
            <p>{t(`editorial.${key}`)}</p>
            {country && (
              <p className="demo-note">{t('editorial.countryBody', { country: country.name })}</p>
            )}
            <Link className="text-link" to={routePath(language, country, 'contacto')}>
              {t('nav.contact')}
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      )}
      {page === 'infraestructura' && (
        <div className="gallery-grid">
          {['regional-office.jpg', 'quality-care.jpg', 'logistics-person.jpg'].map((image) => (
            <figure key={image}>
              <img src={asset(image)} alt={t('editorial.galleryCaption')} loading="lazy" />
              <figcaption>{t('editorial.galleryCaption')}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {page === 'aliados' ? (
        <div className="partner-section">
          <p className="demo-note">{t('editorial.partnerNote')}</p>
          <div className="value-grid">
            {t('editorial.partnerNames', { returnObjects: true }).map((name, index) => (
              <div key={name}>
                <span className="partner-symbol">✳</span>
                <h3>{name}</h3>
                <span className="eyebrow">0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="value-grid">
          {t('editorial.values', { returnObjects: true }).map((name, index) => (
            <div key={name}>
              <span className="eyebrow">0{index + 1}</span>
              <h3>{name}</h3>
              <p>{t(`editorial.valueText.${index}`)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
