import { useState } from 'react';
import Icon from '../../components/Icon';
import { Photo } from '../../components/Media';
import { Avatar } from '../../components/Cards';
import { useUI, useModalClose } from '../../components/UI';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { ago, fmt } from '../../lib/format';
import { CATS, DESTS } from '../../data/catalog';
import { PLANS, VERIFY_LABEL, planOf } from '../../data/plans';
import { compressImage } from './forms';

const PRIORITY = { priority: 0, fast: 1, standard: 2 };

/* Approve / reject with an optional reason (required for reject). */
function Decide({ onApprove, onReject }) {
  const { T } = useLang();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  if (rejecting) {
    return (
      <form className="decide rej" onSubmit={(e) => { e.preventDefault(); if (reason.trim()) onReject(reason.trim()); }}>
        <input className="inp" autoFocus required maxLength={200} placeholder={T('سبب الرفض (هيظهر للشركة)', 'Reason (shown to the agency)')} value={reason} onChange={(e) => setReason(e.target.value)} />
        <button className="btn btn-danger btn-sm">{T('ارفض', 'Reject')}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRejecting(false)}>{T('إلغاء', 'Cancel')}</button>
      </form>
    );
  }
  return (
    <div className="decide">
      <button className="btn btn-teal btn-sm" onClick={onApprove}><Icon name="check" size={15} />{T('وافق', 'Approve')}</button>
      <button className="btn btn-ghost btn-sm" onClick={() => setRejecting(true)}><Icon name="x" size={15} />{T('ارفض', 'Reject')}</button>
    </div>
  );
}

function LicenseModal({ agency: a }) {
  const { T, L } = useLang();
  const close = useModalClose();
  return (
    <>
      <div className="mhead"><h3>{T('صورة الترخيص', 'License image')} — {L(a.name)}</h3><button className="xbtn" onClick={() => close()}><Icon name="x" /></button></div>
      <div className="mbody"><img className="lic-full" src={a.verification.licenseImg} alt={T('صورة الترخيص', 'License image')} /></div>
    </>
  );
}

/* Admin: pending agency verifications + pending offers. */
export function ReviewQueue() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { toast, open } = useUI();
  const ver = store.list('agencies')
    .filter((a) => a.verification?.status === 'pending')
    .sort((a, b) => PRIORITY[planOf(a).verifyPriority] - PRIORITY[planOf(b).verifyPriority] || a.verification.submittedAt - b.verification.submittedAt);
  const offers = store.list('offers').filter((o) => o.review === 'pending').sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const viewImg = (a) => open(() => <LicenseModal agency={a} />, { size: 'lg' });

  return (
    <>
      <div className="panel">
        <h3>{T('طلبات التوثيق', 'Pending verification')}<small>{ver.length} {T('طلب — مرتبين حسب أولوية الباقة', 'requests — ordered by plan priority')}</small></h3>
        {ver.length ? (
          <div className="rq-list">
            {ver.map((a) => {
              const p = planOf(a);
              return (
                <div key={a.id} className="rq-item">
                  <button className="lic-thumb" onClick={() => a.verification.licenseImg && viewImg(a)} disabled={!a.verification.licenseImg} aria-label={T('اعرض صورة الترخيص', 'View license image')}>
                    {a.verification.licenseImg ? <img src={a.verification.licenseImg} alt="" /> : <Icon name="camera" size={22} />}
                  </button>
                  <div className="rq-tx">
                    <div className="cell"><Avatar agency={a} /><b>{L(a.name)}</b><span className={`plan-tag p-${a.plan || 'free'}`}>{L(p.name)} · {L(VERIFY_LABEL[p.verifyPriority])}</span></div>
                    <div className="dim small">{T('رقم الترخيص:', 'License no:')} <b className="ltr">{a.verification.licenseNo}</b> · {T('اتقدّم', 'submitted')} {ago(a.verification.submittedAt, lang)}</div>
                  </div>
                  <Decide
                    onApprove={() => { store.reviewVerification(a.id, true); toast(T('الشركة اتوثّقت', 'Agency verified')); }}
                    onReject={(r) => { store.reviewVerification(a.id, false, r); toast(T('الطلب اترفض', 'Request rejected')); }}
                  />
                </div>
              );
            })}
          </div>
        ) : <div className="empty"><Icon name="shield" size={28} />{T('مفيش طلبات توثيق مستنية', 'No verification requests waiting')}</div>}
      </div>

      <div className="panel">
        <h3>{T('عروض مستنية الموافقة', 'Offers awaiting approval')}<small>{store.settings.moderation ? T('مراجعة العروض الجديدة شغّالة', 'New-offer moderation is on') : T('مراجعة العروض الجديدة مقفولة من الإعدادات', 'New-offer moderation is off (Settings)')}</small></h3>
        {offers.length ? (
          <div className="rq-list">
            {offers.map((o) => {
              const a = store.agency(o.agencyId) || {};
              return (
                <div key={o.id} className="rq-item">
                  <div className="thumb big"><Photo src={o.img} w={300} /></div>
                  <div className="rq-tx">
                    <b>{L(o.title)}</b>
                    <div className="dim small">{L(a.name)} · {L(CATS[o.category])} · {L(DESTS[o.dest])} · {o.nights} {T('ليالي', 'nights')} · <b>{fmt(o.price)}</b> {T('ج.م', 'EGP')}</div>
                    <a className="small" href={`#/offer/${o.id}`} target="_blank" rel="noopener noreferrer">{T('معاينة العرض', 'Preview offer')} ↗</a>
                  </div>
                  <Decide
                    onApprove={() => { store.reviewOffer(o.id, true); toast(T('العرض اتنشر', 'Offer approved')); }}
                    onReject={(r) => { store.reviewOffer(o.id, false, r); toast(T('العرض اترفض', 'Offer rejected')); }}
                  />
                </div>
              );
            })}
          </div>
        ) : <div className="empty"><Icon name="tag" size={28} />{T('مفيش عروض مستنية', 'No offers waiting')}</div>}
      </div>
    </>
  );
}

/* Agency profile: submit license for verification and see the status. */
export function VerificationCard({ agency: a }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const v = a.verification;
  const [no, setNo] = useState(v?.licenseNo || a.license || '');
  const [img, setImg] = useState(v?.status === 'rejected' ? null : v?.licenseImg || null);
  const [editing, setEditing] = useState(!v || v.status === 'rejected');
  const plan = planOf(a);

  const upload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast(T('ارفع صورة بس', 'Please upload an image'), 'err');
    try { setImg(await compressImage(f)); } catch { toast(T('مش قادر أقرا الصورة دي', 'Could not read that image'), 'err'); }
  };
  const submit = (e) => {
    e.preventDefault();
    if (!img) return toast(T('ارفع صورة الترخيص', 'Upload the license image'), 'err');
    store.submitVerification(a.id, { licenseNo: no.trim().slice(0, 30), licenseImg: img });
    setEditing(false);
    toast(T('الطلب اتبعت للإدارة', 'Sent to the admin for review'));
  };

  if (a.verified && v?.status !== 'pending') {
    return <div className="panel ver-card ok"><Icon name="shield" size={22} /><div><b>{T('شركتك موثّقة', 'Your agency is verified')}</b><p className="dim small">{T('علامة التوثيق ظاهرة على عروضك.', 'The verified badge shows on your offers.')}</p></div></div>;
  }
  return (
    <div className="panel ver-card">
      <h3><Icon name="shield" size={18} />{T('توثيق الشركة', 'Get verified')}</h3>
      {v?.status === 'pending' && !editing && (
        <div className="ver-st pending"><Icon name="clock" size={16} /><div><b>{T('طلبك قيد المراجعة', 'Your request is under review')}</b><span className="dim xs">{T('اتبعت', 'Sent')} {ago(v.submittedAt, lang)} · {L(VERIFY_LABEL[plan.verifyPriority])}</span></div></div>
      )}
      {v?.status === 'rejected' && (
        <div className="ver-st rejected"><Icon name="x" size={16} /><div><b>{T('الطلب اترفض', 'Request rejected')}</b><span className="xs">{T('السبب:', 'Reason:')} {v.reason}</span></div></div>
      )}
      {editing ? (
        <form className="form" onSubmit={submit}>
          <p className="dim small">{T('ارفع صورة واضحة لترخيص الشركة من وزارة السياحة ورقمه. الإدارة هتراجعه وتفعّل علامة التوثيق.', 'Upload a clear photo of your tourism license and its number. The admin will review it and enable the verified badge.')}</p>
          <label>{T('رقم الترخيص', 'License number')}<input className="inp ltr" required maxLength={30} value={no} onChange={(e) => setNo(e.target.value)} placeholder="A-1234" /></label>
          <div className="lic-up">
            {img ? <img src={img} alt={T('صورة الترخيص', 'License image')} /> : <span className="dim small">{T('مفيش صورة', 'No image yet')}</span>}
            <label className="btn btn-ghost btn-sm"><Icon name="up" size={15} />{T('ارفع صورة الترخيص', 'Upload license image')}<input type="file" accept="image/*" hidden onChange={upload} /></label>
          </div>
          <button className="btn btn-sun">{T('ابعت للمراجعة', 'Submit for review')}</button>
        </form>
      ) : (
        <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}><Icon name="edit" size={15} />{T('عدّل الطلب', 'Edit request')}</button>
      )}
    </div>
  );
}

export { PLANS };
