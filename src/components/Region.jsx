import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { countries } from '../data/site';
import { routePath } from '../lib/navigation';
import { Arrow } from './Icons';
export default function Region({ language }) {
  const { t } = useTranslation();
  return (
    <div className="region-layout">
      <div className="region-map">
        <div className="map-grid" />
        <svg viewBox="0 0 700 460" role="img" aria-label={t('region.map')}>
          <path
            d="M36 46 139 24 170 80 220 78 253 127 300 110 340 170 378 163 413 223 430 257 478 283 499 340 558 333 602 353 658 327 686 371 648 400 602 392 551 414 491 379 448 350 422 305 381 276 349 238 315 203 276 183 244 208 201 176 170 168 146 128 101 117 64 89Z"
            fill="#264b55"
            stroke="#567079"
            strokeWidth="1"
          />
          <path
            d="M125 110Q240 75 300 129T378 221T462 310T595 354"
            fill="none"
            stroke="#afd9c6"
            strokeDasharray="4 7"
            strokeWidth="1.5"
          />
        </svg>
        {countries.map((country) => (
          <Link
            className="map-point"
            key={country.code}
            style={{ left: `${country.x}%`, top: `${country.y}%` }}
            to={routePath(language, country)}
            aria-label={t('region.visit', { country: country.name })}
          >
            <span />
            <b>{country.code}</b>
          </Link>
        ))}
        <div className="map-foot">
          <span className="status-dot" />
          {t('region.count')}
          <span>01 — 06</span>
        </div>
      </div>
      <div className="country-list">
        {countries.map((country, index) => (
          <Link
            key={country.code}
            className="country-row"
            to={routePath(language, country)}
            aria-label={t('region.visit', { country: country.name })}
          >
            <span className="row-index">0{index + 1}</span>
            <span>
              {country.name}
              <small>{country.city}</small>
            </span>
            <Arrow diagonal />
          </Link>
        ))}
      </div>
    </div>
  );
}
