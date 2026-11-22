import { useMemo } from 'react';
import { fmt } from '../lib/format';
import { STATUS } from '../data/catalog';
import { useLang } from '../lib/i18n';

/* Horizontal bars — one series, one hue, hover tooltip via title */
export function Bars({ rows, color = 'var(--teal)', unit = '' }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="bars">
      {rows.map(([label, n]) => (
        <div className="barrow" key={label} title={`${label}: ${fmt(n)}${unit}`}>
          <span className="lb">{label}</span>
          <div className="track"><div className="fill" style={{ width: `${(n / max) * 100}%`, background: color }} /></div>
          <span className="n">{fmt(n)}</span>
        </div>
      ))}
    </div>
  );
}

/* Line + area chart with hover tooltips per point */
export function LineChart({ values, labels, color = '#14A79D', height = 210, unit = '' }) {
  const W = 640, H = height, P = { l: 30, r: 10, t: 14, b: 26 };
  const n = values.length;
  const max = Math.max(1, ...values) * 1.15;
  const x = (i) => P.l + (W - P.l - P.r) * (n === 1 ? 0.5 : i / (n - 1));
  const y = (v) => P.t + (H - P.t - P.b) * (1 - v / max);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const ticks = [0, 0.5, 1].map((k) => Math.round((max * k) / 1.15));
  const step = Math.ceil(n / 6);
  const gid = useMemo(() => 'lg' + Math.random().toString(36).slice(2, 7), []);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".25" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="grid">
          {ticks.map((tk, i) => (
            <g key={i}><line x1={P.l} x2={W - P.r} y1={y(tk)} y2={y(tk)} /><text x={P.l - 6} y={y(tk) + 4} textAnchor="end">{tk}</text></g>
          ))}
        </g>
        <polygon points={`${x(0)},${y(0)} ${pts} ${x(n - 1)},${y(0)}`} fill={`url(#${gid})`} />
        <polyline className="draw" points={pts} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {values.map((v, i) => (
          <g key={i} className="pt">
            <title>{`${labels[i]}: ${fmt(v)}${unit}`}</title>
            <rect x={x(i) - W / n / 2} y={P.t} width={W / n} height={H - P.t - P.b} fill="transparent" />
            <circle cx={x(i)} cy={y(v)} r={i === n - 1 ? 4.5 : 2.6} fill={i === n - 1 ? color : '#fff'} stroke={color} strokeWidth="2" />
          </g>
        ))}
        {labels.map((lb, i) => (i % step === 0 || i === n - 1 ? <text key={i} x={x(i)} y={H - 6} textAnchor="middle">{lb}</text> : null))}
      </svg>
    </div>
  );
}

/* Stacked status bar with legend (identity never by colour alone) */
export function StatusStack({ counts }) {
  const { L } = useLang();
  const tot = Math.max(1, counts.new + counts.contacted + counts.closed);
  return (
    <>
      <div className="stack">
        {Object.keys(STATUS).map((k) => counts[k] ? <i key={k} style={{ width: `${(counts[k] / tot) * 100}%`, background: STATUS[k].color }} title={`${L(STATUS[k])}: ${counts[k]}`} /> : null)}
      </div>
      <div className="legend">
        {Object.keys(STATUS).map((k) => <span key={k}><i style={{ background: STATUS[k].color }} />{L(STATUS[k])} {counts[k]}</span>)}
      </div>
    </>
  );
}
