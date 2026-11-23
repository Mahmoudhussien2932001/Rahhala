import { useState } from 'react';
import Icon from './Icon';
import { Photo } from './Media';
import { useUI } from './UI';
import { waLink } from './Booking';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { pageUrl } from '../lib/router';
import { ago, fmt } from '../lib/format';
import { ALERT_KINDS, ALERT_STATUS, LOW_SEATS, alertMessage } from '../data/alerts';

/* ---------- heart / favorites ---------- */
export function FavButton({ id, variant = 'chip' }) {
  const { T } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const on = store.isFav(id);
  const click = (e) => {
    e.preventDefault();
    e.stopPropagation();
    store.toggleFav(id);
    toast(on ? T('اتشال من المفضلة', 'Removed from favorites') : T('اتحفظ في المفضلة', 'Saved to favorites'));
  };
  const label = on ? T('شيل من المفضلة', 'Remove from favorites') : T('احفظ في المفضلة', 'Save to favorites');
  if (variant === 'chip') {
    return (
      <button type="button" className={`favbtn ${on ? 'on' : ''}`} onClick={click} aria-pressed={on} aria-label={label} title={label}>
        <Icon name="heart" size={18} style={on ? { fill: 'currentColor' } : undefined} />
      </button>
    );
  }
  return (
    <button type="button" className={`btn btn-sm ${on ? 'btn-fav-on' : 'btn-ghost'}`} onClick={click} aria-pressed={on}>
      <Icon name="heart" size={16} style={on ? { fill: 'currentColor' } : undefined} />{on ? T('في المفضلة', 'Saved') : T('احفظ', 'Save')}
    </button>
  );
}

/* ---------- "notify me" box on the offer page ---------- */
export function AlertBox({ offer: o }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const [open, setOpen] = useState(false);
  const [kinds, setKinds] = useState(['price', 'seats']);
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!kinds.length) return;
    store.addAlert({
      offerId: o.id,
      name: String(f.get('name')).trim().slice(0, 60),
      whatsapp: String(f.get('wa')).replace(/[^\d+]/g, '').slice(0, 16),
      kinds, lang,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="box alertbox done">
        <Icon name="bell" size={20} />
        <p>{T('تمام! الشركة هتبعتلك واتساب لو السعر نزل أو الأماكن قربت تخلص.', "Done! The agency will WhatsApp you if the price drops or seats run low.")}</p>
      </div>
    );
  }

  return (
    <div className="box alertbox">
      <button type="button" className="alert-toggle" aria-expanded={open} onClick={() => setOpen((x) => !x)}>
        <i><Icon name="bell" size={18} /></i>
        <span><b>{T('نبّهني لو السعر نزل', 'Notify me if the price drops')}</b><small>{T('أو لو الأماكن قربت تخلص — من غير ما تحجز دلوقتي', 'or if seats run low — no booking needed')}</small></span>
        <Icon name="chev" size={16} className={open ? 'rot' : ''} />
      </button>
      {open && (
        <form className="form alert-form" onSubmit={submit}>
          <div className="alert-kinds">
            {Object.entries(ALERT_KINDS).map(([k, v]) => (
              <label key={k} className={kinds.includes(k) ? 'on' : ''}>
                <input type="checkbox" checked={kinds.includes(k)} onChange={(e) => setKinds(e.target.checked ? [...kinds, k] : kinds.filter((x) => x !== k))} />
                {L(v)}{k === 'seats' && <small> ({T(`${LOW_SEATS} أو أقل`, `${LOW_SEATS} or fewer`)})</small>}
              </label>
            ))}
          </div>
          <label>{T('الاسم', 'Name')}<input className="inp" name="name" required maxLength={60} autoComplete="name" /></label>
          <label>{T('رقم الواتساب', 'WhatsApp number')}<input className="inp ltr" name="wa" required inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{8,16}" placeholder="+20 10…" /></label>
          <button className="btn btn-teal" disabled={!kinds.length}><Icon name="bell" size={16} />{T('نبّهني', 'Notify me')}</button>
          <p className="dim xs">{T(`السعر دلوقتي ${fmt(o.price)} ج.م — رقمك بيوصل للشركة صاحبة العرض بس.`, `Current price ${fmt(o.price)} EGP — your number is shared only with this agency.`)}</p>
        </form>
      )}
    </div>
  );
}

/* ---------- dashboards: who is waiting on which offer ---------- */
export function AlertsPanel({ list, admin }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { toast, confirm } = useUI();
  const mine = store.currentAgency();
  const visible = admin ? list : list.filter((a) => a.agencyId === mine?.id);
  if (!visible.length) return <div className="empty"><Icon name="bell" size={30} />{T('مفيش حد مستني تنبيه لسه', 'Nobody is waiting for an alert yet')}</div>;

  const order = { ready: 0, waiting: 1, contacted: 2 };
  const groups = {};
  visible.forEach((a) => { (groups[a.offerId] ||= []).push(a); });
  const offerIds = Object.keys(groups).sort((x, y) => {
    const r = (id) => groups[id].filter((a) => a.status === 'ready').length;
    return r(y) - r(x) || groups[y].length - groups[x].length;
  });

  const markContacted = (al) => {
    store.update('alerts', al.id, { status: 'contacted', contactedAt: Date.now() });
    toast(T('اتسجّل إنك كلمته', 'Marked as contacted'));
  };

  return (
    <div className="al-groups">
      {offerIds.map((oid) => {
        const o = store.get('offers', oid);
        const ag = o ? store.agency(o.agencyId) : null;
        const rows = [...groups[oid]].sort((x, y) => order[x.status] - order[y.status] || y.createdAt - x.createdAt);
        const ready = rows.filter((a) => a.status === 'ready').length;
        return (
          <section key={oid} className="al-group">
            <header>
              {o && <div className="thumb"><Photo src={o.img} w={200} /></div>}
              <div className="al-g-tx">
                <b>{o ? L(o.title) : T('عرض محذوف', 'Deleted offer')}</b>
                {o && <span className="dim xs">{fmt(o.price)} {T('ج.م', 'EGP')} · {o.seats} {T('مكان', 'seats')}{admin && ag ? ` · ${L(ag.name)}` : ''}</span>}
              </div>
              <span className="al-count">{rows.length} {T('مستني', 'waiting')}{ready ? <em>{ready} {T('جاهز', 'ready')}</em> : null}</span>
            </header>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>{T('الاسم', 'Name')}</th><th>{T('واتساب', 'WhatsApp')}</th><th>{T('مستني', 'Watching')}</th><th>{T('سعره وقت التسجيل', 'Price at signup')}</th><th>{T('الحالة', 'Status')}</th><th /></tr></thead>
                <tbody>
                  {rows.map((al) => (
                    <tr key={al.id} className={al.status === 'ready' ? 'al-ready' : ''}>
                      <td><b className="fw5">{al.name}</b><div className="dim xs">{ago(al.createdAt, lang)}</div></td>
                      <td className="ltr start">{al.whatsapp}</td>
                      <td className="xs">{(al.kinds || []).map((k) => L(ALERT_KINDS[k])).join(' · ')}</td>
                      <td className="nowrap">{fmt(al.priceAtSignup)}</td>
                      <td>
                        <span className={`al-st st-${al.status}`}>{L(ALERT_STATUS[al.status])}</span>
                        {al.status === 'ready' && (
                          <div className="xs al-why">
                            {al.reason === 'seats'
                              ? T(`فاضل ${al.readySeats} أماكن`, `${al.readySeats} seats left`)
                              : T(`السعر نزل لـ ${fmt(al.readyPrice)}`, `Price dropped to ${fmt(al.readyPrice)}`)}
                          </div>
                        )}
                      </td>
                      <td className="nowrap">
                        {o && al.status === 'ready' && (
                          <a className="btn btn-xs btn-wa" href={waLink(al.whatsapp, alertMessage(al, o, L(ag?.name), pageUrl(`offer/${o.id}`)))} target="_blank" rel="noopener noreferrer" onClick={() => markContacted(al)}>
                            <Icon name="wa" size={15} />{T('ابعت واتساب', 'WhatsApp')}
                          </a>
                        )}{' '}
                        <button className="btn btn-danger btn-xs" aria-label={T('امسح', 'Delete')} onClick={async () => { if (await confirm(T('هتمسح التنبيه ده؟', 'Delete this alert?'), T('امسح', 'Delete'))) store.remove('alerts', al.id); }}><Icon name="trash" size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
