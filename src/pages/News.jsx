import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { articles } from '../data/site';
import { asset } from '../lib/navigation';
import { PageHeading } from './Editorial';
import { Arrow } from '../components/Icons';
export default function News() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const selected = articles.find((article) => article.id === params.get('story'));
  return (
    <section className="section-wrap news-page">
      {selected ? (
        <article>
          <button className="text-link" onClick={() => setParams({})}>
            {t('news.back')}
            <Arrow />
          </button>
          <PageHeading
            title={t(`news.${selected.id}.title`)}
            description={t(`news.${selected.id}.excerpt`)}
            eyebrow={t(`news.${selected.id}.category`)}
          />
          <div className="story-image" data-parallax>
            <img src={asset(selected.image)} alt={t('editorial.galleryCaption')} />
          </div>
          <div className="story-body">
            <span className="eyebrow">
              {t('news.demo')} / {selected.date}
            </span>
            <p>{t(`news.${selected.id}.body`)}</p>
          </div>
        </article>
      ) : (
        <>
          <PageHeading
            title={t('pages.novedades')}
            description={t('news.intro')}
            eyebrow={t('nav.news')}
          />
          <div className="news-grid">
            {articles.map((article) => (
              <article className="news-card" key={article.id}>
                <img src={asset(article.image)} alt={t('editorial.galleryCaption')} />
                <span className="eyebrow">
                  {t(`news.${article.id}.category`)} · {article.date}
                </span>
                <h2>{t(`news.${article.id}.title`)}</h2>
                <p>{t(`news.${article.id}.excerpt`)}</p>
                <button className="text-link" onClick={() => setParams({ story: article.id })}>
                  {t('news.read')}
                  <Arrow diagonal />
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
