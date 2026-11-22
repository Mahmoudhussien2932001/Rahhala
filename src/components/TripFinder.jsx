import { useState } from 'react';
import Icon from './Icon';
import { Photo, Reveal } from './Media';
import Select from './Select';
import { useLang } from '../lib/i18n';
import { navigate } from '../lib/router';
import { storage } from '../lib/storage';
import { GUIDE_ORDER, GUIDES } from '../data/guides';
import { EASY, HELD, NATIONALITIES, STATUS_LABEL, STATUS_RANK, visaFor, visaSteps } from '../data/visas';

/*
  Trip finder for the Guides page:
  1) asks the traveler's nationality and which visas / residence permits they hold,
  2) shows the guide countries they can visit easily vs. ones that need a visa first,
  3) explains how to get each visa, step by step.
*/

const KEY = 'rh_traveler_v1';

export function useTraveler() {
  const [profile, setProfile] = useState(() => storage.get(KEY, null));
  const save = (p) => { storage.set(KEY, p); setProfile(p); };
  const clear = () => { storage.remove(KEY); setProfile(null); };
  return { profile, save, clear };
}

export function natName(code, L) {
  const n = NATIONALITIES.find((x) => x.code === code);
  return n ? L(n) : code;
}

export function StatusBadge({ v }) {
  const { L } = useLang();
  return (
    <span className={`vs vs-${v.status}`}>
      <i />{L(STATUS_LABEL[v.status])}{v.stay ? <small> · {L(v.stay)}</small> : null}
    </span>
  );
}

/* ---------- step 1: the questions ---------- */
export function TravelerForm({ initial, onSave, onCancel }) {
  const { T, L } = useLang();
  const [nat, setNat] = useState(initial?.nat || 'eg');
  const [held, setHeld] = useState(initial?.held || []);
  const toggle = (k) => setHeld((h) => (h.includes(k) ? h.filter((x) => x !== k) : [...h, k]));

  return (
    <Reveal variant="zoom" className="tf-card">
      <div className="tf-step"><span>1</span>{T('جنسيتك إيه؟', "What's your nationality?")}</div>
      <Select
        value={nat}
        onChange={setNat}
        ariaLabel={T('الجنسية', 'Nationality')}
        options={NATIONALITIES.map((x) => ({ value: x.code, label: L(x) }))}
      />
      <div className="tf-step"><span>2</span>{T('معاك تأشيرة أو إقامة سارية من أي بلد من دول؟', 'Do you hold a valid visa or residence permit from any of these?')}</div>
      <p className="tf-help">{T('اختار كل اللي ينطبق عليك — دي ممكن تفتحلك دول من غير تأشيرة.', 'Pick all that apply — these can unlock visa-free or easier entry.')}</p>
      <div className="tf-chips">
        {HELD.map((h) => (
          <button key={h.k} type="button" className={held.includes(h.k) ? 'on' : ''} aria-pressed={held.includes(h.k)} onClick={() => toggle(h.k)}>
            <Icon name={held.includes(h.k) ? 'check' : 'plus'} size={15} />{L(h)}
          </button>
        ))}
        <button type="button" className={held.length === 0 ? 'on none' : 'none'} aria-pressed={held.length === 0} onClick={() => setHeld([])}>
          {T('ولا حاجة', 'None of these')}
        </button>
      </div>
      <div className="tf-actions">
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>{T('إلغاء', 'Cancel')}</button>}
        <button type="button" className="btn btn-sun" onClick={() => onSave({ nat, held })}>{T('وريني الدول المتاحة', 'Show my options')} <Icon name="arrow" flip /></button>
      </div>
      <p className="tf-privacy"><Icon name="lock" size={13} />{T('إجاباتك بتتحفظ على جهازك بس.', 'Your answers stay on this device only.')}</p>
    </Reveal>
  );
}

/* ---------- how-to-get-the-visa panel ---------- */
export function VisaHowTo({ v, dest }) {
  const { T, L } = useLang();
  const s = visaSteps(v.status, dest);
  return (
    <div className="vh">
      <ol className="vh-steps">{s.steps.map((x, i) => <li key={i}><span>{i + 1}</span><p>{L(x)}</p></li>)}</ol>
      {s.fees && <p className="vh-fee"><Icon name="money" size={16} />{L(s.fees)}</p>}
      <div className="vh-docs">
        <b>{T('المستندات اللي هتحتاجها', 'Documents you will need')}</b>
        <ul>{s.docs.map((d, i) => <li key={i}><Icon name="check" size={15} />{L(d)}</li>)}</ul>
      </div>
      {s.tip && <p className="vh-tip"><Icon name="sparkle" size={16} />{L(s.tip)}</p>}
      <a className="btn btn-ghost btn-sm vh-link" href={s.link} target="_blank" rel="noopener noreferrer">
        {T('الموقع الرسمي', 'Official website')} <Icon name="arrow" flip size={15} />
      </a>
    </div>
  );
}

/* ---------- step 2: results ---------- */
function DestCard({ k, v, profile }) {
  const { T, L } = useLang();
  const g = GUIDES[k];
  const [open, setOpen] = useState(false);
  const needsSteps = v.status !== 'home' && v.status !== 'free';
  return (
    <Reveal variant="zoom" className={`tf-dest ${EASY.includes(v.status) ? 'easy' : 'hard'}`}>
      <div className="tf-dest-ph" onClick={() => navigate(`guides?c=${k}`)}>
        <Photo src={g.hero} w={900} />
        <div className="ov" />
        <StatusBadge v={v} />
        <h3>{L(g.name)}</h3>
      </div>
      <div className="tf-dest-tx">
        <p className="muted">{L(g.tagline)}</p>
        {v.via && <p className="tf-via"><Icon name="shield" size={15} />{T('بفضل التأشيرة أو الإقامة اللي معاك', 'Thanks to the visa / permit you hold')}</p>}
        {v.note && <p className="tf-note">{L(v.note)}</p>}
        {v.verify && <p className="tf-verify"><Icon name="clock" size={14} />{T('اتأكد من القاعدة دي قبل ما تحجز', 'Confirm this rule before booking')}</p>}
        <div className="tf-dest-actions">
          <button className="btn btn-sun btn-sm" onClick={() => navigate(`guides?c=${k}`)}>{T('شوف الخطة', 'See the plan')} <Icon name="arrow" flip size={15} /></button>
          {needsSteps && (
            <button className="btn btn-ghost btn-sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              {v.status === 'voa' ? T('هعمل إيه في المطار؟', 'What to do at the airport') : T('إزاي أطلع التأشيرة؟', 'How do I get the visa?')}
              <Icon name="chev" size={15} className={open ? 'rot' : ''} />
            </button>
          )}
        </div>
        {open && <VisaHowTo v={v} dest={k} profile={profile} />}
      </div>
    </Reveal>
  );
}

export function TripFinder({ profile, onEdit }) {
  const { T, L } = useLang();
  const list = GUIDE_ORDER.map((k) => ({ k, v: visaFor(profile.nat, profile.held, k) }))
    .sort((a, b) => STATUS_RANK[a.v.status] - STATUS_RANK[b.v.status]);
  const easy = list.filter((x) => EASY.includes(x.v.status));
  const hard = list.filter((x) => !EASY.includes(x.v.status));
  const heldNames = HELD.filter((h) => profile.held.includes(h.k)).map((h) => L(h));

  return (
    <section className="sec tf-results">
      <div className="wrap">
        <Reveal className="tf-profile">
          <div>
            <span>{T('بنعرضلك على أساس:', 'Showing results for:')}</span>
            <b>{T('جواز', 'Passport:')} {natName(profile.nat, L)}</b>
            {heldNames.map((h) => <em key={h}>{h}</em>)}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onEdit}><Icon name="edit" size={15} />{T('غيّر إجاباتك', 'Change answers')}</button>
        </Reveal>

        {easy.length > 0 && (
          <>
            <Reveal className="head"><div><div className="eyebrow">{T('متاحة ليك', 'Open to you')}</div><h2>{T('دول تقدر تسافرها بسهولة', 'Countries you can visit easily')}</h2></div></Reveal>
            <div className="tf-grid">{easy.map(({ k, v }) => <DestCard key={k} k={k} v={v} profile={profile} />)}</div>
          </>
        )}

        {hard.length > 0 && (
          <>
            <Reveal className="head tf-head2"><div><div className="eyebrow warm">{T('محتاجة تأشيرة الأول', 'Visa needed first')}</div><h2>{T('عايز تروحها؟ دي خطوات التأشيرة', 'Want to go? Here are the visa steps')}</h2>
              <p className="muted">{T('مش مقفولة عليك — بس محتاج تطلع تأشيرة قبل السفر. افتح الخطوات وشوف الخطة كاملة.', "Not closed to you — you just need a visa before you fly. Open the steps and see the full plan.")}</p></div></Reveal>
            <div className="tf-grid">{hard.map(({ k, v }) => <DestCard key={k} k={k} v={v} profile={profile} />)}</div>
          </>
        )}

        <p className="g-disclaimer"><Icon name="shield" size={15} />{T('قواعد التأشيرة بتتغير. المعلومات دي اتراجعت نوفمبر 2026 — اتأكد من الموقع الرسمي أو السفارة قبل الحجز.', 'Visa rules change. This was reviewed in November 2026 — confirm with the official site or embassy before booking.')}</p>
      </div>
    </section>
  );
}

/* ---------- personal visa box inside a single guide ---------- */
export function GuideVisaBox({ dest, profile, onSetup }) {
  const { T, L } = useLang();
  const [open, setOpen] = useState(false);
  if (!profile) {
    return (
      <Reveal className="gv gv-empty">
        <div><b>{T('محتاج تأشيرة؟', 'Do you need a visa?')}</b><p className="muted">{T('قولّنا جنسيتك والتأشيرات اللي معاك ونقولك بالظبط.', 'Tell us your nationality and the visas you hold, and we will tell you exactly.')}</p></div>
        <button className="btn btn-sun btn-sm" onClick={onSetup}>{T('اعرف وضعك', 'Check my visa')} <Icon name="arrow" flip size={15} /></button>
      </Reveal>
    );
  }
  const v = visaFor(profile.nat, profile.held, dest);
  const needsSteps = v.status !== 'home' && v.status !== 'free';
  return (
    <Reveal className={`gv ${EASY.includes(v.status) ? 'easy' : 'hard'}`}>
      <div className="gv-top">
        <div>
          <span className="gv-for">{T('لحامل جواز', 'For a passport from')} {natName(profile.nat, L)}</span>
          <StatusBadge v={v} />
          {v.note && <p className="tf-note">{L(v.note)}</p>}
          {v.verify && <p className="tf-verify"><Icon name="clock" size={14} />{T('اتأكد من القاعدة دي قبل ما تحجز', 'Confirm this rule before booking')}</p>}
        </div>
        <div className="gv-actions">
          {needsSteps && <button className="btn btn-sun btn-sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{v.status === 'voa' ? T('هعمل إيه في المطار؟', 'What to do at the airport') : T('خطوات التأشيرة', 'Visa steps')}<Icon name="chev" size={15} className={open ? 'rot' : ''} /></button>}
          <button className="btn btn-ghost btn-sm" onClick={onSetup}><Icon name="edit" size={15} />{T('غيّر', 'Change')}</button>
        </div>
      </div>
      {open && <VisaHowTo v={v} dest={dest} />}
    </Reveal>
  );
}
