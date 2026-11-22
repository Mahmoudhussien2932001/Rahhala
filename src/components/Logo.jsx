import { useId } from 'react';

/*
  Rahhala logo — sunset behind the mountain, the sea below, inside a gold ring.
  <Logo size={40} />            app-icon mark (rounded square)
  <Logo size={40} round />      circular emblem (no square)
*/
export function Logo({ size = 40, round = false, title = 'Rahhala' }) {
  const id = useId().replace(/:/g, '');
  const bg = `rh-bg-${id}`, gold = `rh-gold-${id}`, clip = `rh-clip-${id}`;
  return (
    <svg viewBox={round ? '12.8 11.8 38.4 38.4' : '0 0 64 64'} width={size} height={size} role="img" aria-label={title}>
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0F4566" /><stop offset="1" stopColor="#061A29" /></linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7D9A0" /><stop offset="1" stopColor="#D9A35A" /></linearGradient>
        <clipPath id={clip}><circle cx="32" cy="31" r="17.2" /></clipPath>
      </defs>
      {round ? <circle cx="32" cy="31" r="18.4" fill="#061A29" /> : <rect width="64" height="64" rx="16" fill={`url(#${bg})`} />}
      <circle cx="32" cy="31" r="18.4" fill="none" stroke={`url(#${gold})`} strokeWidth="1.6" />
      <g clipPath={`url(#${clip})`}>
        <rect x="10" y="10" width="44" height="44" fill={`url(#${bg})`} />
        <circle cx="37.5" cy="25" r="4.2" fill={`url(#${gold})`} />
        <path d="M10 41 L25 22.5 L31.5 30.5 L36.5 25.5 L54 41 Z" fill="#0B2F47" />
        <path d="M10 41 L25 22.5 L31.5 30.5 L36.5 25.5 L54 41" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="10" y="38.5" width="44" height="14" fill="#0E5A6E" />
        <path d="M10 38.6 q3.5 -2.4 7 0 t7 0 t7 0 t7 0 t7 0 t7 0" fill="none" stroke="#5FE0CF" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 43.6 q3.5 -2.2 7 0 t7 0 t7 0 t7 0 t7 0" fill="none" stroke="#5FE0CF" strokeOpacity=".5" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default Logo;
