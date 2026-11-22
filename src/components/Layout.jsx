import { useEffect, useState } from 'react';
import Icon, { Logo } from './Icon';
import { Photo } from './Media';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { useUI } from './UI';
import { Link, navigate } from '../lib/router';
import { CATS } from '../data/catalog';
import { JoinModal } from './Modals';

export function Brand({ light }) {
  const { T } = useLang();
  return (
    <span className={`logo ${light ? 'light' : ''}`}>
      <Logo />
      <span>{T('رحّالة', 'Rahhala')}<small>{T('RAHHALA', 'رحّالة')}</small></span>
    </span>
  );
}

const OVER_PHOTO = ['home', 'offers', 'destinations', 'agencies', 'compare', 'guides'];

export function Navbar({ route }) {
  const { T, toggle, lang } = useLang();
  const store = useStore();
  const { open } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setMenu(false), [route]);

  const solid = scrolled || !OVER_PHOTO.includes(route);
  const a = store.currentAgency();
  const links = [
    ['home', T('الرئيسية', 'Home')],
    ['offers', T('العروض', 'Offers')],
    ['destinations', T('الوجهات', 'Destinations')],
    ['agencies', T('الشركات', 'Agencies')],
    ['guides', T('أدلة السفر', 'Guides')],
    ['compare', T('المقارنة', 'Compare') + (store.compare.length ? ` (${store.compare.length})` : '')],
  ];
  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <div className="wrap bar">
        <Link to="home" aria-label="Rahhala"><Brand /></Link>
        <nav className={`links ${menu ? 'open' : ''}`}>
          {links.map(([k, n]) => <Link key={k} to={k} className={route === k ? 'on' : ''}>{n}</Link>)}
        </nav>
        <div className="actions">
          <button className="lang-btn" onClick={toggle} title="Language">{lang === 'ar' ? 'EN' : 'ع'}</button>
          {store.isAdmin() ? (
            <Link to="admin" className="btn btn-sun btn-sm"><Icon name="grid" /><span className="hide-sm">{T('لوحة الأدمن', 'Admin')}</span></Link>
          ) : a ? (
            <Link to="dashboard" className="btn btn-sun btn-sm"><Icon name="grid" /><span className="hide-sm">{T('لوحة شركتي', 'My dashboard')}</span></Link>
          ) : (
            <>
              <Link to="login" className={`btn btn-sm hide-sm ${solid ? 'btn-ghost' : 'btn-glass'}`}><Icon name="lock" />{T('دخول الشركات', 'Agency login')}</Link>
              <button className="btn btn-sun btn-sm" onClick={() => open(() => <JoinModal />, { size: 'sm' })}>{T('سجّل شركتك', 'List your agency')}</button>
            </>
          )}
          <button className="burger" onClick={() => setMenu((m) => !m)} aria-label="Menu"><Icon name="menu" size={20} /></button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { T, L } = useLang();
  const { open } = useUI();
  return (
    <footer className="footer">
      <div className="footer-photo"><Photo src="px:29747818" w={1800} sizes="100vw" /></div>
      <div className="wrap">
        <div className="cols">
          <div>
            <Brand light />
            <p className="about">{T('منصة بتجمع عروض شركات السياحة المرخّصة في مكان واحد، عشان تقارن وتختار وتحجز مع الشركة مباشرة.', 'One place for offers from licensed travel agencies — compare, choose, and book directly with the agency.')}</p>
          </div>
          <div>
            <h4>{T('استكشف', 'Explore')}</h4>
            {Object.entries(CATS).map(([k, c]) => <a key={k} href={`#/offers?cat=${k}`}>{L(c)}</a>)}
          </div>
          <div>
            <h4>{T('المنصة', 'Platform')}</h4>
            <Link to="destinations">{T('الوجهات', 'Destinations')}</Link>
            <Link to="agencies">{T('الشركات', 'Agencies')}</Link>
            <Link to="compare">{T('المقارنة', 'Compare')}</Link>
          </div>
          <div>
            <h4>{T('للشركات', 'For agencies')}</h4>
            <Link to="login">{T('دخول الشركات', 'Agency login')}</Link>
            <a href="#/" onClick={(e) => { e.preventDefault(); open(() => <JoinModal />, { size: 'sm' }); }}>{T('سجّل شركتك', 'List your agency')}</a>
            <span className="ltr small faded">hello@rahhala.demo</span>
          </div>
        </div>
        <div className="bottom">
          <span>{T('نسخة تجريبية — الشركات والعروض والأسعار وهمية. الصور من Pexels.', 'Demo version — agencies, offers and prices are fictional. Photos from Pexels.')}</span>
          <span className="ltr">© 2026 Rahhala</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHeader({ title, sub, crumb, photo }) {
  const { T } = useLang();
  return (
    <header className="page-head">
      <div className="ph-photo"><Photo src={photo} w={1800} sizes="100vw" priority /></div>
      <div className="ph-shade" />
      <div className="wrap ph-in">
        <div className="crumbs"><Link to="home">{T('الرئيسية', 'Home')}</Link> / {crumb || title}</div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      <svg className="ph-wave" viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0 40 Q 360 0 720 30 T 1440 25 V60 H0Z" /></svg>
    </header>
  );
}

export function CompareBar({ route }) {
  const { T } = useLang();
  const store = useStore();
  const n = store.compare.filter((id) => store.get('offers', id)).length;
  const show = n > 0 && !['compare', 'dashboard', 'admin', 'login'].includes(route);
  return (
    <div className={`cmpbar ${show ? 'show' : ''}`}>
      <Icon name="scale" />
      <span>{T(`${n} من 3 في المقارنة`, `${n} of 3 in comparison`)}</span>
      <button className="btn btn-sun btn-sm" onClick={() => navigate('compare')}>{T('قارن دلوقتي', 'Compare now')}</button>
      <button className="x" onClick={store.clearCompare} title={T('امسح', 'Clear')}><Icon name="x" /></button>
    </div>
  );
}
