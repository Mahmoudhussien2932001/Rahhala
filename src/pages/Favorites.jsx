import Icon from '../components/Icon';
import { Photo, Reveal } from '../components/Media';
import { OfferCard } from '../components/Cards';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { usePageMeta } from '../lib/seo';

/* #/favorites — offers the visitor saved with the heart button (kept per browser). */
export default function Favorites() {
  const { T, L } = useLang();
  const store = useStore();
  usePageMeta(T('المفضلة', 'My favorites'));
  const live = new Set(store.liveOffers().map((o) => o.id));
  const ids = store.favorites;
  const available = ids.filter((id) => live.has(id)).map((id) => store.get('offers', id));
  const gone = ids.filter((id) => !live.has(id));

  return (
    <div className="op-page fav-page">
      <div className="wrap">
        <Reveal className="head">
          <div>
            <div className="eyebrow"><Icon name="heart" size={14} /> {T('محفوظة على الجهاز ده', 'Saved on this device')}</div>
            <h1 className="h-lg">{T('المفضلة', 'My favorites')} <span className="dim">({available.length})</span></h1>
          </div>
          {available.length > 1 && available.length <= 3 && (
            <button className="btn btn-ghost btn-sm" onClick={() => { store.clearCompare(); available.forEach((o) => store.toggleCompare(o.id)); navigate('compare'); }}>
              <Icon name="scale" size={16} />{T('قارن بينهم', 'Compare them')}
            </button>
          )}
        </Reveal>

        {available.length ? (
          <div className="grid-offers">{available.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div>
        ) : (
          <div className="empty fav-empty">
            <Icon name="heart" size={32} />
            <h3>{T('لسه ما حفظتش أي عرض', "You haven't saved any offers yet")}</h3>
            <p>{T('دوس على القلب في أي عرض عشان ترجعله بعدين.', 'Tap the heart on any offer to come back to it later.')}</p>
            <button className="btn btn-sun" onClick={() => navigate('offers')}>{T('تصفّح العروض', 'Browse offers')}</button>
          </div>
        )}

        {gone.length > 0 && (
          <div className="fav-gone">
            <h3 className="h-sm">{T('مبقتش متاحة', 'No longer available')}</h3>
            {gone.map((id) => {
              const o = store.get('offers', id);
              return (
                <div key={id} className="box mini">
                  {o && <div className="thumb"><Photo src={o.img} w={200} /></div>}
                  <span>{o ? L(o.title) : T('عرض اتشال', 'Removed offer')}</span>
                  <button className="btn btn-ghost btn-xs" onClick={() => store.toggleFav(id)}><Icon name="trash" size={14} />{T('شيل', 'Remove')}</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
