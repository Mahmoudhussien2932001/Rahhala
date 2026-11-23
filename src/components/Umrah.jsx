import Icon from './Icon';
import { useLang } from '../lib/i18n';
import { FLIGHT_TYPES, fmtDistance, umrahOf, walkMinutes } from '../data/umrah';

/* Umrah details box on the offer page. Renders nothing for non-Umrah offers or offers without details. */
export function UmrahDetails({ offer }) {
  const { T, L } = useLang();
  const u = umrahOf(offer);
  if (!u) return null;
  const mk = +u.nightsMakkah || 0, md = +u.nightsMadinah || 0, total = mk + md;
  const ft = FLIGHT_TYPES[u.flight];

  const Place = ({ city, hotel, dist, mosque }) => (
    <div className="um-place">
      <span className="um-city">{city}</span>
      <b>{hotel || T('الفندق هيتحدد', 'Hotel to be confirmed')}</b>
      {dist !== null && dist !== undefined && (
        <span className="um-dist">
          <Icon name="walk" size={15} />{fmtDistance(dist, T)} {T('من', 'to')} {mosque}
          <em>≈ {walkMinutes(dist)} {T('دقيقة مشي', 'min walk')}</em>
        </span>
      )}
    </div>
  );

  return (
    <div className="box umrah-box">
      <h4><Icon name="moon" size={17} />{T('تفاصيل العمرة', 'Umrah details')}</h4>
      <div className="um-places">
        <Place city={T('مكة المكرمة', 'Makkah')} hotel={u.hotelMakkah} dist={u.distanceHaram} mosque={T('الحرم', 'the Haram')} />
        <Place city={T('المدينة المنورة', 'Madinah')} hotel={u.hotelMadinah} dist={u.distanceNabawi} mosque={T('المسجد النبوي', "the Prophet's Mosque")} />
      </div>
      {total > 0 && (
        <div className="um-split" aria-label={T(`${mk} ليالي في مكة و${md} في المدينة`, `${mk} nights in Makkah, ${md} in Madinah`)}>
          <div className="um-bar"><i style={{ flexGrow: mk }} /><i style={{ flexGrow: md }} /></div>
          <div className="um-legend"><span><b>{mk}</b> {T('ليالي مكة', 'nights Makkah')}</span><span><b>{md}</b> {T('ليالي المدينة', 'nights Madinah')}</span></div>
        </div>
      )}
      {ft && (
        <div className="um-flight">
          <Icon name={ft.icon} size={17} /><b>{L(ft)}</b>{u.airline ? <span className="dim"> · {u.airline}</span> : null}
        </div>
      )}
    </div>
  );
}

/* One-line summary for Umrah offer cards. */
export function UmrahLine({ offer }) {
  const { T, L } = useLang();
  const u = umrahOf(offer);
  if (!u) return null;
  const ft = FLIGHT_TYPES[u.flight];
  return (
    <div className="um-line">
      {u.distanceHaram != null && <span><Icon name="walk" size={14} />{fmtDistance(u.distanceHaram, T)} {T('من الحرم', 'to Haram')}</span>}
      {ft && <span><Icon name={ft.icon} size={14} />{L(ft)}</span>}
    </div>
  );
}
