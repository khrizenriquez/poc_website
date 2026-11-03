import { asset } from '../lib/navigation';

export default function CountryFlag({ code }) {
  return (
    <img
      className="country-flag"
      src={asset(`flags/${code.toLowerCase()}.svg`)}
      width="15"
      height="15"
      alt=""
      aria-hidden="true"
    />
  );
}
