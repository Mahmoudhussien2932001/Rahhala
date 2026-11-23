import Icon from './Icon';
import { useLang } from '../lib/i18n';
import { useNow } from '../lib/useNow';
import { flashActive } from '../lib/offers';

/* Flash-deal countdown. variant 'chip' (cards) or 'box' (offer page). Renders nothing when no deal runs. */
export function FlashCountdown({ offer, variant = 'chip' }) {
  const { T } = useLang();
  const running = flashActive(offer);
  const now = useNow(running);
  if (!flashActive(offer, now)) return null;

  const left = Math.max(0, +new Date(offer.flashEndsAt) - now);
  const d = Math.floor(left / 864e5);
  const h = Math.floor((left % 864e5) / 36e5);
  const m = Math.floor((left % 36e5) / 6e4);
  const s = Math.floor((left % 6e4) / 1e3);
  const pad = (n) => String(n).padStart(2, '0');

  if (variant === 'chip') {
    const txt = d > 0 ? `${d}${T('ي', 'd')} ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`;
    return (
      <span className="flash-chip" title={T('عرض لفترة محدودة', 'Limited-time deal')}>
        <Icon name="fire" size={13} />{T('ينتهي خلال', 'Ends in')} <bdi dir="ltr">{txt}</bdi>
      </span>
    );
  }
  const units = [
    [d, T('يوم', 'days')], [h, T('ساعة', 'hrs')], [m, T('دقيقة', 'min')], [s, T('ثانية', 'sec')],
  ];
  return (
    <div className="flash-box" role="timer" aria-live="off">
      <div className="fb-head"><Icon name="fire" size={16} /><b>{T('عرض لفترة محدودة', 'Flash deal')}</b><span>{T('الخصم ينتهي خلال', 'Discount ends in')}</span></div>
      <div className="fb-units">
        {units.map(([v, l]) => <div key={l}><b>{pad(v)}</b><small>{l}</small></div>)}
      </div>
    </div>
  );
}
