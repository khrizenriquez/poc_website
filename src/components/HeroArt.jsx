import { Component, Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from './Motion';
const NetworkScene = lazy(() => import('./NetworkScene'));
export function supportsWebGL() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'));
  } catch {
    return false;
  }
}
export class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export function StaticNetwork() {
  return (
    <svg className="static-network" viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <linearGradient id="orbit-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#153e4c" />
          <stop offset=".45" stopColor="#b4d7d8" />
          <stop offset=".75" stopColor="#7ba2b4" />
          <stop offset="1" stopColor="#214d57" />
        </linearGradient>
      </defs>
      <ellipse
        cx="300"
        cy="300"
        rx="254"
        ry="101"
        fill="none"
        stroke="#adc2bb"
        strokeWidth="1"
        transform="rotate(-30 300 300)"
      />
      {[0, 60, 120].map((angle) => (
        <ellipse
          key={angle}
          cx="300"
          cy="300"
          rx="150"
          ry="205"
          transform={`rotate(${angle} 300 300)`}
          fill="none"
          stroke="url(#orbit-gradient)"
          strokeWidth="43"
        />
      ))}
      <circle cx="79" cy="428" r="9" fill="#295b55" />
      <circle cx="520" cy="171" r="6" fill="#295b55" />
    </svg>
  );
}
export default function HeroArt() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [supported] = useState(supportsWebGL);
  const [lost, setLost] = useState(false);
  const fallback = <StaticNetwork />;
  return (
    <div className="hero-visual" role="img" aria-label={t('hero.orbit')}>
      <div className="orbit-halo" />
      {supported && !reduced && !lost ? (
        <SceneBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <NetworkScene onLost={() => setLost(true)} />
          </Suspense>
        </SceneBoundary>
      ) : (
        fallback
      )}
      <span className="orbit-tag orbit-tag-top">
        <span className="status-dot" /> {t('hero.orbit')}
      </span>
      <span className="orbit-tag orbit-tag-bottom">14° 38′ N &nbsp; / &nbsp; 90° 30′ W</span>
      <span className="orbit-caption">PoC / CONNECTED</span>
    </div>
  );
}
