import Icon from '../components/Icon';
import { PageHeader } from '../components/Layout';
import { AgencyCard, Avatar, Verified, stars } from '../components/Cards';
import { Photo, Reveal } from '../components/Media';
import { OfferModal } from '../components/Modals';
import { useUI } from '../components/UI';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { CITIES, DESTS, FEATURES } from '../data/catalog';
import { discount, fdate, money } from '../lib/format';
import { ExploreCard } from '../components/Explore';
import { FLIGHT_TYPES, fmtDistance, umrahOf } from '../data/umrah';
import { GROUPS, SCOPES } from '../data/explore';

export function Destinations({ query }) {
  const { T, L } = useLang();
  const scope = SCOPES[query.get('s')] ? query.get('s') : 'egypt';
  const s = SCOPES[scope];
  return (
    <>
      <PageHeader key={scope} title={L(s.name)} sub={L(s.sub)} crumb={T('الوجهات', 'Destinations')} photo={s.photo} />
      <div className="wrap sec-sm">
        <div className="scope-tabs" role="tablist" aria-label={T('نوع السفر', 'Trip scope')}>
          {Object.entries(SCOPES).map(([k, x]) => (
            <button key={k} role="tab" aria-selected={k === scope} className={k === scope ? 'on' : ''} onClick={() => navigate(`destinations?s=${k}`)}>
              <Photo src={x.photo} w={200} sizes="48px" />
              <span><b>{L(x.name)}</b><small>{L(x.sub)}</small></span>
            </button>
          ))}
        </div>
        {GROUPS[scope].map((g) => (
          <div key={g.name.en} className="dest-group">
            <Reveal className="head xg-head">
              <div className="xg-title">
                <i><Icon name={g.icon} size={20} /></i>
                <div><h2 className="h-md">{L(g.name)}</h2><p className="muted">{L(g.sub)}</p></div>
              </div>
            </Reveal>
            <div className="xc-grid">{g.items.map((it, i) => <ExploreCard key={it.dest || it.guide} dest={it.dest} guide={it.guide} i={i} />)}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Agencies() {
  const { T } = useLang();
  const store = useStore();
  const list = store.liveAgencies().sort((a, b) => b.verified - a.verified || b.rating - a.rating);
  return (
    <>
      <PageHeader title={T('شركات السياحة', 'Travel agencies')} sub={T(`${list.length} شركة · ${list.filter((a) => a.verified).length} موثّقة`, `${list.length} agencies · ${list.filter((a) => a.verified).length} verified`)} photo="px:7529416" />
      <div className="wrap sec-sm">
        {list.length ? <div className="grid-ag">{list.map((a, i) => <AgencyCard key={a.id} agency={a} i={i} />)}</div> : <div className="empty">{T('لسه مفيش شركات', 'No agencies yet')}</div>}
      </div>
    </>
  );
}

export function Compare() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open } = useUI();
  const list = store.compare.map((id) => store.get('offers', id)).filter(Boolean);
  const header = <PageHeader title={T('قارن العروض', 'Compare offers')} sub={T('لحد 3 عروض جنب بعض', 'Up to 3 offers side by side')} photo="px:1268871" />;

  if (list.length < 2) {
    return (
      <>
        {header}
        <div className="wrap sec-sm"><div className="empty"><Icon name="scale" size={30} /><p>{T('اختار عرضين أو تلاتة من صفحة العروض بزرار "قارن"', 'Pick two or three offers using the "Compare" button')}</p><button className="btn btn-primary mt12" onClick={() => navigate('offers')}>{T('روح للعروض', 'Browse offers')}</button></div></div>
      </>
    );
  }
  const minP = Math.min(...list.map((o) => o.price));
  const minN = Math.min(...list.map((o) => o.price / o.nights));
  const maxR = Math.max(...list.map((o) => store.agency(o.agencyId)?.rating || 0));
  const maxF = Math.max(...list.map((o) => (o.features || []).length));
  const hasUmrah = list.some((o) => umrahOf(o));
  const dists = (k) => list.map((o) => umrahOf(o)?.[k]).filter((v) => v != null);
  const minHaram = Math.min(...dists('distanceHaram'));
  const minNabawi = Math.min(...dists('distanceNabawi'));
  const Row = ({ label, render, best }) => (
    <tr><th>{label}</th>{list.map((o) => <td key={o.id} className={best && best(o) ? 'best' : ''}>{render(o)}</td>)}</tr>
  );
  return (
    <>
      {header}
      <div className="wrap sec-sm">
        <div className="toolbar"><b>{T(`${list.length} عروض`, `${list.length} offers`)}</b><button className="btn btn-ghost btn-sm" onClick={store.clearCompare}><Icon name="trash" />{T('امسح المقارنة', 'Clear comparison')}</button></div>
        <div className="scroll-x">
          <table className="cmp-table" style={{ minWidth: list.length * 250 + 170 }}>
            <tbody>
              <tr><th />{list.map((o) => (
                <td key={o.id}>
                  <div className="cmp-ph"><Photo src={o.img} w={700} /></div>
                  <b>{L(o.title)}</b>
                  <div className="row-start mt8">
                    <button className="btn btn-primary btn-xs" onClick={() => open(() => <OfferModal id={o.id} />, { size: 'lg' })}>{T('التفاصيل والحجز', 'Details & booking')}</button>
                    <button className="btn btn-ghost btn-xs" onClick={() => store.toggleCompare(o.id)}>{T('شيل', 'Remove')}</button>
                  </div>
                </td>
              ))}</tr>
              <Row label={T('الشركة', 'Agency')} render={(o) => { const a = store.agency(o.agencyId) || {}; return <span className="chip-ag wide"><Avatar agency={a} />{L(a.name)}{a.verified && <Verified />}</span>; }} />
              <Row label={T('السعر للفرد', 'Price / person')} render={(o) => <><b className="accent lg">{money(o.price, lang)}</b>{o.price === minP && <span className="st closed">{T('الأرخص', 'Cheapest')}</span>}</>} best={(o) => o.price === minP} />
              <Row label={T('سعر الليلة', 'Per night')} render={(o) => money(Math.round(o.price / o.nights), lang)} best={(o) => o.price / o.nights === minN} />
              <Row label={T('الخصم', 'Discount')} render={(o) => (discount(o) ? `${discount(o)}%` : '—')} />
              <Row label={T('الوجهة', 'Destination')} render={(o) => L(DESTS[o.dest])} />
              <Row label={T('المدة', 'Duration')} render={(o) => `${o.nights} ${T('ليالي', 'nights')}`} />
              <Row label={T('ميعاد السفر', 'Departure')} render={(o) => fdate(o.date, lang)} />
              <Row label={T('السفر من', 'From')} render={(o) => L(CITIES[o.from])} />
              <Row label={T('الأماكن المتاحة', 'Seats left')} render={(o) => o.seats} />
              <Row label={T('تقييم الشركة', 'Agency rating')} render={(o) => { const a = store.agency(o.agencyId) || {}; return <><span className="stars">{stars(a.rating)}</span> {a.rating}</>; }} best={(o) => (store.agency(o.agencyId)?.rating || 0) === maxR} />
              {hasUmrah && (
                <>
                  <tr className="cmp-sec"><th colSpan={list.length + 1}><Icon name="moon" size={15} /> {T('تفاصيل العمرة', 'Umrah details')}</th></tr>
                  <Row label={T('فندق مكة', 'Makkah hotel')} render={(o) => umrahOf(o)?.hotelMakkah || '—'} />
                  <Row label={T('المسافة للحرم', 'Distance to Haram')} render={(o) => (umrahOf(o)?.distanceHaram != null ? fmtDistance(umrahOf(o).distanceHaram, T) : '—')} best={(o) => umrahOf(o)?.distanceHaram != null && umrahOf(o).distanceHaram === minHaram} />
                  <Row label={T('فندق المدينة', 'Madinah hotel')} render={(o) => umrahOf(o)?.hotelMadinah || '—'} />
                  <Row label={T('المسافة للمسجد النبوي', "Distance to Prophet's Mosque")} render={(o) => (umrahOf(o)?.distanceNabawi != null ? fmtDistance(umrahOf(o).distanceNabawi, T) : '—')} best={(o) => umrahOf(o)?.distanceNabawi != null && umrahOf(o).distanceNabawi === minNabawi} />
                  <Row label={T('الليالي مكة / المدينة', 'Nights Makkah / Madinah')} render={(o) => { const u = umrahOf(o); return u && u.nightsMakkah != null ? `${u.nightsMakkah} / ${u.nightsMadinah ?? '—'}` : '—'; }} />
                  <Row label={T('السفر', 'Travel')} render={(o) => { const u = umrahOf(o); return u?.flight ? <>{L(FLIGHT_TYPES[u.flight])}{u.airline ? <div className="dim xs">{u.airline}</div> : null}</> : '—'; }} best={(o) => umrahOf(o)?.flight === 'direct'} />
                </>
              )}
              <Row label={T('بيشمل', 'Includes')} render={(o) => <div className="inc">{(o.features || []).map((k) => <span key={k}>{L(FEATURES[k]) || k}</span>)}</div>} best={(o) => (o.features || []).length === maxF} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Login() {
  const { T } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = store.login(f.get('email'), f.get('pass'));
    if (!r.ok) {
      toast(r.error === 'suspended' ? T('حساب الشركة موقوف، كلّم الإدارة', 'This agency is suspended') : T('الإيميل أو الباسورد غلط', 'Wrong email or password'), 'err');
      return;
    }
    toast(T('أهلاً بيك 👋', 'Welcome 👋'));
    navigate(r.role === 'admin' ? 'admin' : 'dashboard');
  };
  const fill = (e, p) => {
    const form = document.getElementById('login-form');
    form.elements.email.value = e; form.elements.pass.value = p;
  };
  return (
    <section className="auth">
      <div className="auth-art">
        <Photo src="px:29747818" w={1600} sizes="50vw" priority />
        <div className="auth-shade" />
        <p className="q">{T('كل عرض هنا بداية رحلة — أضف عروضك وخلّي المسافرين يلاقوك.', 'Every offer here is the start of a journey — add yours and let travelers find you.')}</p>
      </div>
      <div className="auth-form">
        <Reveal className="card">
          <h2>{T('دخول الشركات والإدارة', 'Agency & admin login')}</h2>
          <p className="muted mb18">{T('ادخل بالإيميل والباسورد اللي إدارة المنصة عملتهولك.', 'Use the email and password the platform admin created for you.')}</p>
          <form id="login-form" className="form" onSubmit={submit}>
            <label>{T('الإيميل', 'Email')}<input className="inp ltr" name="email" type="email" required autoComplete="username" /></label>
            <label>{T('الباسورد', 'Password')}<input className="inp ltr" name="pass" type="password" required autoComplete="current-password" /></label>
            <button className="btn btn-primary big">{T('دخول', 'Sign in')}</button>
          </form>
          <div className="demo">
            <b>{T('حسابات تجريبية', 'Demo accounts')}</b><br />
            {T('أدمن:', 'Admin:')} <code>mahmoudhussien200111@gmail.com</code> / <code>Admin@2026</code> <button type="button" onClick={() => fill('mahmoudhussien200111@gmail.com', 'Admin@2026')}>{T('املا', 'Fill')}</button><br />
            {T('شركة:', 'Agency:')} <code>madar@demo.com</code> / <code>Demo@123</code> <button type="button" onClick={() => fill('madar@demo.com', 'Demo@123')}>{T('املا', 'Fill')}</button><br />
            <span className="dim">{T('وباقي الشركات: seastar، ofok، peaks... @demo.com بنفس الباسورد', 'Other agencies: seastar, ofok, peaks... @demo.com, same password')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
