import Icon from '../components/Icon';
import { Reveal } from '../components/Media';
import { PageHeader } from '../components/Layout';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { usePageMeta } from '../lib/seo';
import { fmt } from '../lib/format';
import { PLANS, PLAN_ORDER, VERIFY_LABEL, planKey } from '../data/plans';

/* #/pricing — agency plans, fully driven by data/plans.js */
export default function Pricing() {
  const { T, L } = useLang();
  const store = useStore();
  usePageMeta(T('باقات الشركات', 'Plans for agencies'), T('اختار الباقة المناسبة لشركتك: عدد العروض، الظهور المميز، والإحصائيات.', 'Pick the right plan for your agency: live offers, featured placement and analytics.'));
  const mine = store.currentAgency();
  const current = mine ? planKey(mine) : null;
  const contact = 'mailto:hello@rahhala.demo';

  const rows = (p) => [
    [p.maxLive === Infinity ? T('عروض ظاهرة بلا حدود', 'Unlimited live offers') : T(`لحد ${p.maxLive} عروض ظاهرة`, `Up to ${p.maxLive} live offers`), true],
    [p.featuredSlots ? T(`${p.featuredSlots} عرض مميز في الصفحة الرئيسية`, `${p.featuredSlots} featured offer${p.featuredSlots > 1 ? 's' : ''} on the home page`) : T('مفيش ظهور مميز', 'No featured placement'), !!p.featuredSlots],
    [p.analytics ? T('إحصائيات كاملة ومقارنة بالسوق', 'Full analytics & market price comparison') : T('إحصائيات أساسية', 'Basic stats'), true],
    [L(VERIFY_LABEL[p.verifyPriority]), true],
    [T('قائمة الانتظار وتنبيهات الأسعار', 'Waiting list & price alerts'), true],
    [T('استيراد العروض من ملف CSV', 'Bulk CSV import'), true],
  ];

  return (
    <>
      <PageHeader title={T('باقات الشركات', 'Plans for agencies')} sub={T('ابدأ مجاناً، وكبّر ظهورك لما تكبر', 'Start free and grow your reach as you grow')} crumb={T('الباقات', 'Pricing')} photo="px:7529416" />
      <section className="wrap sec-sm">
        <div className="plans">
          {PLAN_ORDER.map((k, i) => {
            const p = PLANS[k];
            return (
              <Reveal key={k} delay={i * 90} className={`plan ${p.popular ? 'popular' : ''} ${current === k ? 'current' : ''}`}>
                {p.popular && <span className="plan-flag">{T('الأكتر اختياراً', 'Most popular')}</span>}
                <h3>{L(p.name)}</h3>
                <p className="dim small">{L(p.tagline)}</p>
                <div className="plan-price">
                  {p.price ? <><b>{fmt(p.price)}</b><span>{T('ج.م / شهر', 'EGP / month')}</span></> : <b>{T('مجاناً', 'Free')}</b>}
                </div>
                <ul>
                  {rows(p).map(([txt, ok]) => <li key={txt} className={ok ? '' : 'off'}><Icon name={ok ? 'check' : 'x'} size={15} />{txt}</li>)}
                </ul>
                {current === k ? (
                  <span className="btn btn-ghost plan-btn" aria-current="true"><Icon name="check" size={16} />{T('باقتك الحالية', 'Your current plan')}</span>
                ) : mine ? (
                  <a className={`btn plan-btn ${p.popular ? 'btn-sun' : 'btn-ghost'}`} href={`${contact}?subject=${encodeURIComponent(`Upgrade ${L(mine.name)} to ${p.name.en}`)}`}>{T('اطلب الترقية', 'Request this plan')}</a>
                ) : (
                  <button className={`btn plan-btn ${p.popular ? 'btn-sun' : 'btn-ghost'}`} onClick={() => navigate('login')}>{k === 'free' ? T('ابدأ مجاناً', 'Start free') : T('اشترك', 'Get started')}</button>
                )}
              </Reveal>
            );
          })}
        </div>
        <p className="center dim small mt22">{T('الأسعار شاملة الضريبة. الأدمن بيفعّل الباقة بعد التواصل معاك.', 'Prices include tax. The admin activates your plan after we get in touch.')}</p>
      </section>
    </>
  );
}
