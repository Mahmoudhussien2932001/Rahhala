import { useEffect, useRef, useState } from 'react';
import { Photo } from './Media';
import Icon from './Icon';
import { useLang } from '../lib/i18n';

/*
  Cinematic hero: real landscape photos that cross-fade with a slow
  Ken Burns zoom, mouse parallax, animated captions and progress dots.
*/
export const HERO_SLIDES = [
  { photo: 'px:22643850', place: { ar: 'الغردقة، البحر الأحمر', en: 'Hurghada, Red Sea' }, word: { ar: 'البحر', en: 'the sea' }, dest: 'hurghada' },
  { photo: 'px:29747818', place: { ar: 'جبال دهب، جنوب سيناء', en: 'Dahab mountains, South Sinai' }, word: { ar: 'الجبل', en: 'the mountains' }, dest: 'catherine' },
  { photo: 'px:35564654', place: { ar: 'المسجد الحرام، مكة', en: 'Masjid al-Haram, Makkah' }, word: { ar: 'العمرة', en: 'Umrah' }, dest: 'mecca' },
  { photo: 'px:16660047', place: { ar: 'كازبيجي، جورجيا', en: 'Kazbegi, Georgia' }, word: { ar: 'الطبيعة', en: 'nature' }, dest: 'georgia' },
  { photo: 'px:14065506', place: { ar: 'بحيرة الزيتون، سيوة', en: 'Zeitoun Lake, Siwa' }, word: { ar: 'الصحرا', en: 'the desert' }, dest: 'siwa' },
  { photo: 'px:1287460', place: { ar: 'المالديف', en: 'Maldives' }, word: { ar: 'الجزر', en: 'islands' }, dest: 'maldives' },
];

export default function HeroSlider({ children, onWord }) {
  const { L } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const stage = useRef(null);
  const DURATION = 7000;

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((x) => (x + 1) % HERO_SLIDES.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused]);

  useEffect(() => { onWord?.(HERO_SLIDES[i]); }, [i, onWord]);

  // mouse parallax on the photo stage
  useEffect(() => {
    let raf, tx = 0, ty = 0, x = 0, y = 0;
    const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * -18; ty = (e.clientY / window.innerHeight - 0.5) * -12; };
    const tick = () => {
      x += (tx - x) * 0.05; y += (ty - y) * 0.05;
      if (stage.current) stage.current.style.transform = `translate3d(${x.toFixed(2)}px, ${(y + window.scrollY * 0.25).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); };
  }, []);

  const s = HERO_SLIDES[i];
  return (
    <section className="hero">
      <div className="hero-stage" ref={stage}>
        {HERO_SLIDES.map((sl, k) => (
          <div key={sl.photo} className={`hero-slide ${k === i ? 'on' : ''} kb-${k % 3}`}>
            <Photo src={sl.photo} w={2000} sizes="100vw" priority={k < 2} />
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
            <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={L(sl.place)}>
              <i style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
            </button>
          ))}
          <button className="hero-pause" onClick={() => setPaused((p) => !p)} aria-label="pause"><Icon name={paused ? 'play' : 'pause'} size={14} /></button>
        </div>
      </div>
    </section>
  );
}
