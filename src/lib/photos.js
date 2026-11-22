/*
  Real photos from Pexels (free to use: https://www.pexels.com/license/).
  An image reference is stored as 'px:<pexels id>' or as an uploaded data URL.
  Before going to production, download the photos you keep into /public
  and point to them, so the site does not depend on the Pexels CDN.
*/
export const px = (id, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export function photoSrc(ref, w = 1200) {
  if (!ref) return '';
  if (typeof ref === 'number') return px(ref, w);
  if (ref.startsWith('px:')) return px(ref.slice(3), w);
  return ref; // data URL or absolute URL
}

export function photoSrcSet(ref) {
  if (!ref || typeof ref !== 'string' || !ref.startsWith('px:')) return undefined;
  const id = ref.slice(3);
  return [640, 1000, 1600].map((w) => `${px(id, w)} ${w}w`).join(', ');
}
