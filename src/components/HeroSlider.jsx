import { useEffect, useRef, useState } from 'react';
import { Photo } from './Media';
import Icon from './Icon';
import { useLang } from '../lib/i18n';
import { photoSrc, photoSrcSet } from '../lib/photos';

/*
  Cinematic hero: real landscape photos that cross-fade with a slow
  Ken Burns zoom, mouse parallax, animated captions and progress dots.

  Performance:
  - The first photo is preloaded from index.html (keep it in sync with HERO_SLIDES[0]).
  - Every slide shows a tiny (~2 KB) low-res version instantly, then the sharp photo fades in.
  - Only the current slide's photo is downloaded at first; the next one is fetched in the
    background, and the slider waits for it before switching, so there is never an empty frame.
  - The parallax loop only runs while the pointer or page is actually moving.
*/
export const HERO_SLIDES = [
  { photo: 'px:29095916', place: { ar: 'البحر الأحمر، مصر', en: 'Red Sea, Egypt' }, word: { ar: 'البحر', en: 'the sea' }, dest: 'hurghada' },
  { photo: 'px:39811855', place: { ar: 'جبال دهب وقت الغروب، جنوب سيناء', en: 'Dahab mountains at sunset, South Sinai' }, word: { ar: 'الجبل', en: 'the mountains' }, dest: 'dahab' },
  { photo: 'px:31339194', place: { ar: 'المسجد الحرام، مكة', en: 'Masjid al-Haram, Makkah' }, word: { ar: 'العمرة', en: 'Umrah' }, dest: 'mecca' },
  { photo: 'px:16660047', place: { ar: 'كازبيجي، جورجيا', en: 'Kazbegi, Georgia' }, word: { ar: 'الطبيعة', en: 'nature' }, dest: 'georgia' },
  { photo: 'px:16908872', place: { ar: 'الصحرا الغربية، مصر', en: 'Western Desert, Egypt' }, word: { ar: 'الصحرا', en: 'the desert' }, dest: 'whitedesert' },
  { photo: 'px:9482125', place: { ar: 'المالديف', en: 'Maldives' }, word: { ar: 'الجزر', en: 'islands' }, dest: 'maldives' },
];

const N = HERO_SLIDES.length;
const DURATION = 7000;

// Download a slide photo exactly as the <img> would pick it (same srcset/sizes → shared cache).
const loaded = new Map();
function preload(k) {
  if (!loaded.has(k)) {
    loaded.set(k, new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.sizes = '100vw';
      img.srcset = photoSrcSet(HERO_SLIDES[k].photo) || '';
      img.src = photoSrc(HERO_SLIDES[k].photo, 2000);
      const done = () => (img.decode ? img.decode().catch(() => {}).then(resolve) : resolve());
      img.onload = done;
      img.onerror = resolve; // never block the slider on a failed photo
    }));
  }
  return loaded.get(k);
}

export default function HeroSlider({ children, onWord }) {
  const { L } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(() => new Set([0]));
  const stage = useRef(null);

  const show = (k) => { setMounted((m) => (m.has(k) ? m : new Set(m).add(k))); setI(k); };

  // Autoplay: wait the slide duration AND for the next photo to be ready.
  useEffect(() => {
    if (paused) return;
    let alive = true;
    const next = (i + 1) % N;
    // start fetching the next photo after the current one, so it doesn't compete with it
    const warm = setTimeout(() => preload(next), 1200);
    const timer = new Promise((r) => setTimeout(r, DURATION));
    Promise.all([timer, preload(i).then(() => preload(next))]).then(() => { if (alive) show(next); });
    return () => { alive = false; clearTimeout(warm); };
  }, [i, paused]);

  useEffect(() => { onWord?.(HERO_SLIDES[i]); }, [i, onWord]);

  // Mouse/scroll parallax — the rAF loop sleeps once the motion settles.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0, sy = -1;
    const apply = () => {
      if (stage.current) stage.current.style.transform = `translate3d(${x.toFixed(2)}px, ${(y + window.scrollY * 0.25).toFixed(2)}px, 0)`;
    };
    const tick = () => {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      const scrollY = window.scrollY;
      apply();
      const settled = Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05 && scrollY === sy;
      sy = scrollY;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * -18; ty = (e.clientY / window.innerHeight - 0.5) * -12; wake(); };
    if (reduce) return undefined;
    if (fine) window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('scroll', wake); };
  }, []);

  const s = HERO_SLIDES[i];
  return (
    <section className="hero">
      <div className="hero-stage" ref={stage}>
        {HERO_SLIDES.map((sl, k) => (
          <div key={sl.photo} className={`hero-slide ${k === i ? 'on' : ''} kb-${k % 3}`}>
            {mounted.has(k) && (
              <Photo src={sl.photo} w={2000} sizes="100vw" priority style={{ backgroundImage: `url(${photoSrc(sl.photo, 60)})` }} />
            )}
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-grain" />
      {children}
      <div className="hero-foot wrap">
        <div className="hero-place" key={i}><Icon name="pin" size={15} />{L(s.place)}<span className="credit"><Icon name="camera" size={13} />Pexels</span></div>
        <div className="hero-dots">
          {HERO_SLIDES.map((sl, k) => (
            <button key={k} className={k === i ? 'on' : ''} onClick={() => show(k)} aria-label={L(sl.place)}>
              <i style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
            </button>
          ))}
          <button className="hero-pause" onClick={() => setPaused((p) => !p)} aria-label="pause"><Icon name={paused ? 'play' : 'pause'} size={14} /></button>
        </div>
      </div>
    </section>
  );
}
