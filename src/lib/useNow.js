import { useEffect, useState } from 'react';

/*
  One shared 1-second ticker for every countdown on the page (instead of one interval per card).
  Components subscribe only while mounted; the interval stops when nobody is listening.
*/
const subs = new Set();
let timer = null;

function start() {
  if (!timer) timer = setInterval(() => { const t = Date.now(); subs.forEach((fn) => fn(t)); }, 1000);
}
function stop() {
  if (timer && !subs.size) { clearInterval(timer); timer = null; }
}

export function useNow(enabled = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return undefined;
    subs.add(setNow);
    start();
    return () => { subs.delete(setNow); stop(); };
  }, [enabled]);
  return now;
}
