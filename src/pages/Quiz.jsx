import { useState } from 'react';
import Icon from '../components/Icon';
import { Photo, Reveal } from '../components/Media';
import { OfferCard } from '../components/Cards';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { usePageMeta } from '../lib/seo';
import { MONTHS } from '../lib/format';
import { DESTS } from '../data/catalog';
import { BUDGETS, VIBES, WHO, matchOffers } from '../data/quiz';

/* #/quiz — "Find my trip": 4 quick questions → ranked offers with "why this matches". */

const EMPTY = { budget: null, month: null, who: null, vibes: [] };
const STEPS = ['budget', 'month', 'who', 'vibes'];

export default function Quiz() {
  const { T, L, lang } = useLang();
  const store = useStore();
  usePageMeta(T('اعرف رحلتك', 'Find my trip'), T('جاوب على 4 أسئلة ونرشحلك أنسب العروض.', 'Answer 4 quick questions and we will suggest the best-matching offers.'));
  const saved = store.prefs.quiz;
  const [a, setA] = useState(() => saved?.done ? saved : EMPTY);
  const [step, setStep] = useState(() => (saved?.done ? 4 : 0));
  const [dir, setDir] = useState('fwd');

  const go = (s) => { setDir(s > step ? 'fwd' : 'back'); setStep(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const pick = (k, v) => {
    const next = { ...a, [k]: v };
    setA(next);
    if (k !== 'vibes') setTimeout(() => go(step + 1), 180); // single-choice steps advance on their own
  };
  const finish = () => { const done = { ...a, done: true }; store.setPref('quiz', done); setA(done); go(4); };
  const restart = () => { store.setPref('quiz', null); setA(EMPTY); go(0); };

  const titles = [
    T('ميزانيتك كام للفرد؟', "What's your budget per person?"),
    T('ناوي تسافر إمتى؟', 'When do you want to travel?'),
    T('مسافر مع مين؟', "Who's travelling?"),
    T('عايز رحلتك تبقى عاملة إزاي؟', 'What kind of trip are you after?'),
  ];

  return (
    <div className="op-page quiz-page">
      <div className="wrap quiz-wrap">
        <div className="quiz-top">
          <div className="eyebrow"><Icon name="sparkle" size={14} /> {T('اعرف رحلتك', 'Find my trip')}</div>
          {step < 4 && (
            <div className="quiz-progress" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label={T('خطوات الأسئلة', 'Quiz progress')}>
              {STEPS.map((s, i) => <i key={s} className={i < step ? 'done' : i === step ? 'on' : ''} />)}
              <span>{T(`سؤال ${step + 1} من 4`, `Question ${step + 1} of 4`)}</span>
            </div>
          )}
        </div>

        {step < 4 ? (
          <div key={step} className={`quiz-step ${dir}`}>
            <h1 className="quiz-q">{titles[step]}</h1>

            {step === 0 && (
              <div className="qz-opts">
                {BUDGETS.map((b) => (
                  <button key={b.k} className={a.budget === b.k ? 'on' : ''} onClick={() => pick('budget', b.k)}>
                    <Icon name="money" size={20} /><b>{L(b)}</b>{b.max !== Infinity && <small>{T('ج.م للفرد', 'EGP per person')}</small>}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="qz-opts months">
                {MONTHS[lang].map((m, i) => (
                  <button key={m} className={a.month === i + 1 ? 'on' : ''} onClick={() => pick('month', i + 1)}><b>{m}</b></button>
                ))}
                <button className={`wide ${a.month === 'any' ? 'on' : ''}`} onClick={() => pick('month', 'any')}><Icon name="cal" size={18} /><b>{T('أي وقت — أنا مرن', "Any time — I'm flexible")}</b></button>
              </div>
            )}

            {step === 2 && (
              <div className="qz-opts">
                {Object.entries(WHO).map(([k, w]) => (
                  <button key={k} className={a.who === k ? 'on' : ''} onClick={() => pick('who', k)}>
                    <Icon name={w.icon} size={22} /><b>{L(w)}</b>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <>
                <p className="dim center">{T('اختار واحدة أو أكتر', 'Pick one or more')}</p>
                <div className="qz-vibes">
                  {Object.entries(VIBES).map(([k, v]) => {
                    const on = a.vibes.includes(k);
                    return (
                      <button key={k} className={on ? 'on' : ''} aria-pressed={on} onClick={() => pick('vibes', on ? a.vibes.filter((x) => x !== k) : [...a.vibes, k])}>
                        <Photo src={v.photo} w={600} sizes="(max-width: 700px) 50vw, 20vw" />
                        <span className="ov" />
                        <span className="tick"><Icon name="check" size={16} /></span>
                        <b>{L(v)}</b>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="quiz-nav">
              {step > 0 ? <button className="btn btn-ghost" onClick={() => go(step - 1)}><Icon name="arrow" size={16} />{T('رجوع', 'Back')}</button> : <span />}
              {step === 3 && <button className="btn btn-sun" disabled={!a.vibes.length} onClick={finish}><Icon name="sparkle" size={16} />{T('وريني رحلاتي', 'Show my trips')}</button>}
              {step < 3 && a[STEPS[step]] != null && <button className="btn btn-ghost" onClick={() => go(step + 1)}>{T('التالي', 'Next')} <Icon name="arrow" flip size={16} /></button>}
            </div>
          </div>
        ) : (
          <Results answers={a} onRestart={restart} onEdit={go} />
        )}
      </div>
    </div>
  );
}

function Results({ answers: a, onRestart, onEdit }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const results = matchOffers(store.liveOffers(), a, { DESTS, MONTHS }).slice(0, 6);
  const budget = BUDGETS.find((b) => b.k === a.budget);
  const chips = [
    [0, budget ? L(budget) : '—'],
    [1, a.month === 'any' ? T('أي وقت', 'Any time') : new Date(2026, a.month - 1, 1).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', { month: 'long' })],
    [2, WHO[a.who] ? L(WHO[a.who]) : '—'],
    [3, a.vibes.map((v) => L(VIBES[v])).join(' · ')],
  ];

  return (
    <div className="quiz-step fwd">
      <h1 className="quiz-q">{results.length ? T('دي أنسب الرحلات ليك', 'Your best-matching trips') : T('ملقيناش رحلة مناسبة بالظبط', "We couldn't find an exact match")}</h1>
      <div className="qz-chips">
        {chips.map(([s, txt]) => <button key={s} onClick={() => onEdit(s)} title={T('عدّل', 'Edit')}>{txt}<Icon name="edit" size={13} /></button>)}
        <button className="restart" onClick={onRestart}><Icon name="reset" size={14} />{T('من الأول', 'Start over')}</button>
      </div>

      {results.length ? (
        <div className="qz-results">
          {results.map((r, i) => (
            <Reveal key={r.offer.id} delay={(i % 3) * 80} className="qz-res">
              <div className="qz-why">
                <span className="qz-pct">{r.pct}%</span>
                <div>
                  <b>{i === 0 ? T('الأنسب ليك', 'Best match') : T('مناسب ليك', 'Good match')}</b>
                  <ul>{r.reasons.map((x, j) => <li key={j}><Icon name="check" size={13} />{L(x)}</li>)}</ul>
                </div>
              </div>
              <OfferCard offer={r.offer} i={0} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Icon name="search" size={30} />
          <p>{T('جرّب تزوّد الميزانية أو تختار نوع رحلة تاني.', 'Try a higher budget or another kind of trip.')}</p>
          <button className="btn btn-sun" onClick={() => onEdit(0)}>{T('عدّل الإجابات', 'Change answers')}</button>
        </div>
      )}
      <p className="center mt22"><button className="btn btn-ghost" onClick={() => navigate('offers')}>{T('شوف كل العروض', 'See all offers')} <Icon name="arrow" flip size={16} /></button></p>
    </div>
  );
}
