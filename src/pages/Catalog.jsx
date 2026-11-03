import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { products } from '../data/site';
import { filterProducts } from '../lib/catalog';
import { routePath } from '../lib/navigation';
import Dialog from '../components/Dialog';
import { PageHeading } from './Editorial';
import { Arrow } from '../components/Icons';
export default function Catalog({ country, language }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);
  const filtered = filterProducts(products, query, category, t);
  return (
    <section className="section-wrap catalog-page">
      <PageHeading
        title={t('pages.productos')}
        description={t('products.description')}
        eyebrow={t('products.eyebrow')}
      />
      <div className="catalog-controls">
        <label>
          <span>{t('products.search')}</span>
          <input
            type="search"
            value={query}
            maxLength={100}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="P01…"
          />
        </label>
        <label>
          <span>{t('products.category')}</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {['all', 'wellness', 'care', 'nutrition'].map((item) => (
              <option key={item} value={item}>
                {t(`products.${item}`)}
              </option>
            ))}
          </select>
        </label>
        <button
          className="text-link"
          onClick={() => {
            setQuery('');
            setCategory('all');
          }}
        >
          {t('products.reset')}
        </button>
      </div>
      <p role="status" className="result-count">
        {t('products.result', { count: filtered.length })}
      </p>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product, index) => (
            <article key={product.id} className="product-card">
              <div className={`product-visual product-tone-${index % 3}`} aria-hidden="true">
                <div className={`product-package ${product.formatKey}`}>
                  <span>PoC</span>
                  <b>{product.id}</b>
                  <small>DEMO</small>
                </div>
              </div>
              <span className="eyebrow">{t(`products.${product.category}`)}</span>
              <h2>{t(`products.names.${product.nameKey}`)}</h2>
              <p>{t(`products.formats.${product.formatKey}`)}</p>
              <button
                className="text-link"
                onClick={() => setSelected(product)}
                aria-label={`${t('products.details')}: ${t(`products.names.${product.nameKey}`)}`}
              >
                {t('products.details')}
                <Arrow diagonal />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{t('products.empty')}</h2>
          <p>{t('products.emptyText')}</p>
        </div>
      )}
      {selected && (
        <Dialog title={t(`products.names.${selected.nameKey}`)} onClose={close}>
          <p className="eyebrow">
            {t('products.code')}: {selected.id}
          </p>
          <p>{t(`products.formats.${selected.formatKey}`)}</p>
          <p className="demo-note">{t('products.demo')}</p>
          <Link
            className="button button-dark"
            to={`${routePath(language, country, 'pedidos')}?product=${selected.id}`}
          >
            {t('products.request')}
            <Arrow />
          </Link>
        </Dialog>
      )}
    </section>
  );
}
