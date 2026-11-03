export function Arrow({ diagonal = false }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Logo() {
  return (
    <span className="wordmark">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path d="M8 4h12a10 10 0 0 1 0 20h-5v8H8zm7 7v6h5a3 3 0 0 0 0-6z" fill="currentColor" />
        <circle cx="29" cy="29" r="3" fill="var(--mint)" />
      </svg>
      PoC<span className="wordmark-dot">.</span>
    </span>
  );
}
