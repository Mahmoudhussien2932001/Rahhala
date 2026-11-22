import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { Logo } from '../components/Logo';
import Markdown from '../components/Markdown';
import { PageHeader } from '../components/Layout';
import { OfferModal } from '../components/Modals';
import { useUI } from '../components/UI';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { storage } from '../lib/storage';
import { CITIES, DESTS, FEATURES } from '../data/catalog';

/*
  "Plan with AI" page — a travel assistant powered by Claude.
  It answers travel questions, builds day-by-day plans with cost estimates,
  and recommends real Rahhala offers (sent along as context on every request).
  The Claude call happens on the server in /api/chat.js.
*/

const CHAT_KEY = 'rh_chat_v1';

const SUGGESTIONS = [
  { icon: 'cal', ar: 'خطّطلي 5 أيام في دهب لشخصين بميزانية 20 ألف', en: 'Plan 5 days in Dahab for 2 people on a 20,000 EGP budget' },
  { icon: 'shield', ar: 'إيه الأوراق اللي محتاجها لعمرة من القاهرة؟', en: 'What documents do I need for Umrah from Cairo?' },
  { icon: 'plane', ar: 'أحسن وقت أسافر جورجيا إمتى، وتكلفة أسبوع كام تقريباً؟', en: "When's the best time for Georgia, and roughly what does a week cost?" },
  { icon: 'list', ar: 'اعملّي ليستة شنطة لرحلة سفاري وتخييم في سانت كاترين', en: 'Make me a packing list for a safari & camping trip in St. Catherine' },
];

// Compact, model-friendly view of the live catalog.
function offersContext(store) {
  const en = (o) => (o && (o.en || o.ar)) || '';
  return store.liveOffers().map((o) => {
    const a = store.get('agencies', o.agencyId);
    const d = DESTS[o.dest];
    return [
      o.id,
      en(o.title),
      `${en(d)} (${en(d?.country)})`,
      `from ${en(CITIES[o.from])}`,
      `${o.nights} nights`,
      `${o.price} EGP${o.oldPrice > o.price ? ` (was ${o.oldPrice})` : ''}`,
      `departs ${o.date}`,
      `${o.seats} seats left`,
      `includes: ${(o.features || []).map((f) => en(FEATURES[f]) || f).join(', ')}`,
      `agency: ${en(a?.name)} (rating ${a?.rating}${a?.verified ? ', verified' : ''})`,
    ].join(' | ');
  }).join('\n');
}

export default function Planner() {
  const { T, lang } = useLang();
  const store = useStore();
  const { open } = useUI();
  const [msgs, setMsgs] = useState(() => storage.get(CHAT_KEY, []));
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const abort = useRef(null);
  const cleared = useRef(false);
  const end = useRef(null);
  const box = useRef(null);
  const offers = useMemo(() => offersContext(store), [store]);

  useEffect(() => { if (!busy) storage.set(CHAT_KEY, msgs.slice(-30)); }, [msgs, busy]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [msgs, busy]);
  useEffect(() => () => abort.current?.abort(), []);

  const showOffer = (id) => { if (store.get('offers', id)) open(() => <OfferModal id={id} />, { size: 'lg' }); };

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput('');
    setError(null);
    const history = [...msgs, { role: 'user', content: q }];
    setMsgs([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    let reply = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-20), offers, lang }),
        signal: ctrl.signal,
      });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || type.includes('application/json')) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `http_${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += dec.decode(value, { stream: true });
        setMsgs([...history, { role: 'assistant', content: reply }]);
      }
      reply += dec.decode();
      if (!reply.trim()) throw new Error('empty');
      setMsgs([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      if (e.name === 'AbortError') {
        if (cleared.current) { cleared.current = false; return; }
        // Keep what arrived; drop the turn entirely if nothing did.
        setMsgs(reply.trim() ? [...history, { role: 'assistant', content: reply }] : msgs);
      } else {
        setMsgs(msgs); // roll back so the conversation stays valid (user/assistant alternating)
        setInput(q);
        setError(e.message);
      }
    } finally {
      setBusy(false);
      abort.current = null;
      box.current?.focus();
    }
  };

  const errorText = {
    rate_limited: T('بعت رسايل كتير ورا بعض، استنى دقايق وجرّب تاني.', "You've sent a lot of messages — wait a few minutes and try again."),
    busy: T('المساعد عليه ضغط دلوقتي، جرّب كمان شوية.', 'The assistant is busy right now — try again shortly.'),
    server_not_configured: T('المساعد لسه مش متفعّل على السيرفر (مفتاح الـ API ناقص).', "The assistant isn't set up on the server yet (missing API key)."),
    refusal: T('المساعد مقدرش يجاوب على ده. جرّب تسأل بطريقة تانية.', "The assistant couldn't answer that. Try asking another way."),
  }[error] || T('حصلت مشكلة في الاتصال، جرّب تاني.', 'Something went wrong — please try again.');

  const empty = msgs.length === 0;
  return (
    <>
      <PageHeader
        title={T('خطّط رحلتك مع رحّالة AI', 'Plan your trip with Rahhala AI')}
        sub={T('اسأل عن أي حاجة في السفر: خطة يوم بيوم، التكلفة، الأماكن، الأوراق، وأنسب العروض ليك.', 'Ask anything about your trip: a day-by-day plan, costs, places to visit, documents — and the offers that fit you.')}
        crumb={T('مساعد السفر', 'Trip assistant')}
        photo="px:39811855"
      />
      <section className="sec pt0 planner">
        <div className="wrap planner-wrap">
          <div className="chat">
            <div className="chat-top">
              <div className="chat-id"><Logo size={36} /><div><b>{T('مساعد رحّالة', 'Rahhala Assistant')}</b><span>{busy ? T('بيكتب…', 'Typing…') : T('جاهز يساعدك', 'Ready to help')}</span></div></div>
              {!empty && <button className="btn btn-ghost btn-sm" onClick={() => { if (abort.current) { cleared.current = true; abort.current.abort(); } setMsgs([]); setError(null); }}><Icon name="reset" size={15} />{T('محادثة جديدة', 'New chat')}</button>}
            </div>

            <div className="chat-body" aria-live="polite">
              {empty ? (
                <div className="chat-empty">
                  <div className="ce-mark"><Logo size={64} /></div>
                  <h2>{T('رايح فين؟ أنا أظبطهالك', 'Where to? I’ll sort it out')}</h2>
                  <p className="muted">{T('قولّي وجهتك وعدد الأيام وميزانيتك، وأنا أعملك خطة كاملة وأرشحلك عروض من الشركات.', 'Tell me your destination, how many days and your budget — I’ll build a full plan and suggest agency offers.')}</p>
                  <div className="ce-grid">
                    {SUGGESTIONS.map((s) => (
                      <button key={s.en} onClick={() => send(lang === 'ar' ? s.ar : s.en)}>
                        <i><Icon name={s.icon} size={18} /></i><span>{lang === 'ar' ? s.ar : s.en}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                msgs.map((m, k) => (
                  <div key={k} className={`msg ${m.role}`}>
                    {m.role === 'assistant' && <span className="av"><Logo size={30} /></span>}
                    <div className="bubble">
                      {m.role === 'user' ? <p>{m.content}</p>
                        : m.content ? <Markdown text={m.content} onOffer={showOffer} />
                          : <span className="typing"><i /><i /><i /></span>}
                    </div>
                  </div>
                ))
              )}
              {error && <div className="chat-err"><Icon name="x" size={16} />{errorText}</div>}
              <div ref={end} />
            </div>

            <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
              <textarea
                ref={box}
                rows={1}
                value={input}
                maxLength={2000}
                placeholder={T('اكتب سؤالك… مثلاً: عايز أسافر شرم 4 أيام بـ 15 ألف', 'Ask anything… e.g. 4 days in Sharm for 15,000 EGP')}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}
              />
              {busy
                ? <button type="button" className="btn btn-ghost send" onClick={() => abort.current?.abort()} aria-label={T('وقّف', 'Stop')}><Icon name="pause" size={18} /></button>
                : <button className="btn btn-sun send" disabled={!input.trim()} aria-label={T('ابعت', 'Send')}><Icon name="arrow" flip size={18} /></button>}
            </form>
            <p className="chat-note">{T('الأسعار والمعلومات تقديرية من الذكاء الاصطناعي — أكّد التفاصيل مع الشركة أو الجهات الرسمية قبل الحجز.', 'Prices and info are AI estimates — confirm details with the agency or official sources before booking.')}</p>
          </div>
        </div>
      </section>
    </>
  );
}
