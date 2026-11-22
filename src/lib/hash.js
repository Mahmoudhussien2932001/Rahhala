// Small dependency-free SHA-256 (demo password hashing only — NOT real security).
const sha256 = (() => {
  const primes = [];
  for (let n = 2; primes.length < 64; n++) if (primes.every((p) => n % p)) primes.push(n);
  const frac = (x) => Math.floor((x - Math.floor(x)) * 4294967296) >>> 0;
  const K = primes.map((p) => frac(Math.cbrt(p)));
  const H0 = primes.slice(0, 8).map((p) => frac(Math.sqrt(p)));
  const ror = (x, n) => (x >>> n) | (x << (32 - n));
  return (str) => {
    const b = new TextEncoder().encode(str);
    const l = b.length;
    const L = ((l + 9 + 63) >> 6) << 6;
    const m = new Uint8Array(L);
    m.set(b);
    m[l] = 0x80;
    const dv = new DataView(m.buffer);
    dv.setUint32(L - 4, (l * 8) >>> 0);
    dv.setUint32(L - 8, Math.floor((l * 8) / 4294967296));
    let h = H0.slice();
    const w = new Uint32Array(64);
    for (let i = 0; i < L; i += 64) {
      for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
      for (let t = 16; t < 64; t++) {
        const a = w[t - 15], c = w[t - 2];
        w[t] = (w[t - 16] + (ror(a, 7) ^ ror(a, 18) ^ (a >>> 3)) + w[t - 7] + (ror(c, 17) ^ ror(c, 19) ^ (c >>> 10))) >>> 0;
      }
      let [A, B, C, D, E, F, G, HH] = h;
      for (let t = 0; t < 64; t++) {
        const t1 = (HH + (ror(E, 6) ^ ror(E, 11) ^ ror(E, 25)) + ((E & F) ^ (~E & G)) + K[t] + w[t]) >>> 0;
        const t2 = ((ror(A, 2) ^ ror(A, 13) ^ ror(A, 22)) + ((A & B) ^ (A & C) ^ (B & C))) >>> 0;
        HH = G; G = F; F = E; E = (D + t1) >>> 0; D = C; C = B; B = A; A = (t1 + t2) >>> 0;
      }
      h = [A, B, C, D, E, F, G, HH].map((v, k) => (h[k] + v) >>> 0);
    }
    return h.map((x) => x.toString(16).padStart(8, '0')).join('');
  };
})();

export const passHash = (email, pass) => sha256(`rahhala|${String(email).toLowerCase().trim()}|${pass}`);
