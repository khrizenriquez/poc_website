import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { products } from '../data/site';
import { initialForm, validateForm } from '../lib/forms';
import { asset } from '../lib/navigation';
import { PageHeading } from './Editorial';
import { Arrow } from '../components/Icons';
export default function DemoForm({ page, country }) {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...initialForm,
    reference: products.some((product) => product.id === params.get('product'))
      ? params.get('product')
      : '',
  }));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const form = useRef(null);
  const successRef = useRef(null);
  function change(event) {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      if (name === 'anonymous') {
        delete next.name;
        delete next.email;
      }
      return next;
    });
  }
  function submit(event) {
    event.preventDefault();
    const next = validateForm(values, page);
    setErrors(next);
    if (Object.keys(next).length) {
      form.current.elements[Object.keys(next)[0]].focus();
      return;
    }
    setValues({ ...initialForm });
    setSuccess(true);
  }
  const field = (name, type, maxLength) => (
    <label className="field">
      <span id={`${name}-label`}>{t(`forms.${name}`)}</span>
      <input
        aria-labelledby={`${name}-label`}
        name={name}
        type={type}
        value={values[name]}
        onChange={change}
        maxLength={maxLength}
        autoComplete="off"
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <span className="field-error" id={`${name}-error`}>
          {t(`forms.errors.${errors[name]}`)}
        </span>
      )}
    </label>
  );
  return (
    <section className="section-wrap form-page">
      <PageHeading
        title={t(`pages.${page}`)}
        description={t('forms.intro')}
        eyebrow={country ? t(`countries.${country.code}.name`) : t('regional')}
      />
      <div className="form-layout">
        <aside>
          <img
            src={asset(page === 'trabaja-con-nosotros' ? 'people-team.jpg' : 'pharmacy.jpg')}
            alt={t('editorial.galleryCaption')}
          />
          <h2>{t('hero.orbit')}</h2>
          <p>{t(page === 'trabaja-con-nosotros' ? 'forms.careers' : 'home.introText')}</p>
          <p className="demo-note">{t('forms.demo')}</p>
          {['farmacovigilancia', 'etica-y-denuncias'].includes(page) && (
            <p className="demo-note">{t('forms.urgent')}</p>
          )}
        </aside>
        {success ? (
          <div
            className="form-success"
            role="status"
            tabIndex={-1}
            ref={(node) => {
              successRef.current = node;
              node?.focus();
            }}
          >
            <span className="success-icon">✓</span>
            <h2>{t('forms.success')}</h2>
            <p>{t('forms.successBody')}</p>
            <button
              className="button button-dark"
              onClick={() => {
                setSuccess(false);
                setErrors({});
              }}
            >
              {t('forms.again')}
              <Arrow />
            </button>
          </div>
        ) : (
          <form ref={form} onSubmit={submit} noValidate>
            {Object.keys(errors).length > 0 && (
              <p className="error-summary" role="alert">
                {t('forms.summary')}
              </p>
            )}
            {page === 'etica-y-denuncias' && (
              <label className="checkbox-field">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={values.anonymous}
                  onChange={change}
                />
                <span>{t('forms.anonymous')}</span>
              </label>
            )}
            {!values.anonymous && (
              <div className="field-row">
                {field('name', 'text', 80)}
                {field('email', 'email', 160)}
              </div>
            )}
            {['pedidos', 'devoluciones'].includes(page) && (
              <label className="field">
                <span id="reference-label">{t('forms.reference')}</span>
                <select
                  aria-labelledby="reference-label"
                  name="reference"
                  value={values.reference}
                  onChange={change}
                  aria-invalid={Boolean(errors.reference)}
                  aria-describedby={errors.reference ? 'reference-error' : undefined}
                >
                  <option value="">{t('forms.optional')}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.id} · {t(`products.names.${product.nameKey}`)}
                    </option>
                  ))}
                </select>
                {errors.reference && (
                  <span className="field-error" id="reference-error">
                    {t('forms.errors.reference')}
                  </span>
                )}
              </label>
            )}
            {page === 'pedidos' && field('quantity', 'number', undefined)}
            <label className="field">
              <span id="message-label">{t('forms.message')}</span>
              <textarea
                aria-labelledby="message-label"
                name="message"
                value={values.message}
                onChange={change}
                rows={6}
                maxLength={1500}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              <small className="field-counter">{values.message.length}/1500</small>
              {errors.message && (
                <span className="field-error" id="message-error">
                  {t('forms.errors.message')}
                </span>
              )}
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="consent"
                checked={values.consent}
                onChange={change}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? 'consent-error' : undefined}
              />
              <span>{t('forms.consent')}</span>
            </label>
            {errors.consent && (
              <p className="field-error" id="consent-error">
                {t('forms.errors.consent')}
              </p>
            )}
            <button className="button button-dark" type="submit">
              {t('forms.submit')}
              <Arrow diagonal />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
