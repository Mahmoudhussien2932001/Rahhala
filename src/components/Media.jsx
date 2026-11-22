import { useEffect, useRef, useState } from 'react';
import { photoSrc, photoSrcSet } from '../lib/photos';
import { fmt } from '../lib/format';

/* Photo with a soft placeholder, fade-in on load and a graceful fallback */
export function Photo({ src, alt = '', className = '', w = 1200, sizes = '(max-width: 760px) 100vw, 40vw', priority = false, style }) {
  const [state, setState] = useState('loading');
  const url = photoSrc(src, w);
  useEffect(() => { setState('loading'); }, [url]);
  return (
    <div className={`photo ${state} ${className}`} style={style}>
      {url && state !== 'error' && (
        <img
          key={url}
          src={url}
          srcSet={photoSrcSet(src)}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
        />
      )}
    </div>
  );
}

/* In-view hook (fires once) */
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, inView];
}

/* Scroll reveal wrapper. variant: up | fade | zoom | left | right | blur */
export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`rv rv-${variant} ${inView ? 'in' : ''} ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/* Animated number */
export function Counter({ to, duration = 1400, suffix = '' }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf; const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{fmt(v)}{suffix}</span>;
}

/* Background photo that drifts while you scroll */
export function ParallaxPhoto({ src, strength = 0.18, children, className = '' }) {
  const wrap = useRef(null);
  const layer = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      const el = wrap.current, ly = layer.current;
      if (el && ly) {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        ly.style.transform = `translate3d(0, ${(-center * strength).toFixed(1)}px, 0) scale(1.18)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [strength]);
  return (
    <div ref={wrap} className={`parallax ${className}`}>
      <div ref={layer} className="parallax-layer"><Photo src={src} w={1800} sizes="100vw" /></div>
      {children}
    </div>
  );
}
