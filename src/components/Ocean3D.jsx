import { useEffect, useRef, useState } from 'react';
import { Photo } from './Media';

/*
  Realistic 3D ocean at golden hour (three.js Water + Sky shaders).
  - Physically based sky (Preetham) with a slowly moving sun
  - Reflective animated water with a procedural normal map (no texture files)
  - Distant low-poly mountain range on the horizon
  - Camera drifts gently and follows the mouse
  Falls back to a real photo if WebGL is unavailable.
*/
export default function Ocean3D({ fallback = 'px:22643850', className = '', children }) {
  const host = useRef(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import('three');
        const { Water } = await import('three/examples/jsm/objects/Water.js');
        const { Sky } = await import('three/examples/jsm/objects/Sky.js');
        if (disposed || !host.current) return;
        cleanup = buildScene(THREE, Water, Sky, host.current, () => !disposed && setReady(true));
      } catch (e) {
        console.warn('Ocean3D disabled:', e);
        if (!disposed) setFailed(true);
      }
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className={`ocean ${ready ? 'ready' : ''} ${className}`}>
      <div className="ocean-fallback"><Photo src={fallback} w={1800} sizes="100vw" /></div>
      {!failed && <div ref={host} className="ocean-canvas" />}
      {children}
    </div>
  );
}

function waterNormals(THREE) {
  // Tileable normal map built from sine waves with integer frequencies.
  const N = 256, c = document.createElement('canvas');
  c.width = c.height = N;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(N, N);
  const waves = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 28; i++) {
    const kx = Math.round((rnd() - 0.5) * 2 * (2 + i * 0.7));
    const ky = Math.round((rnd() - 0.5) * 2 * (2 + i * 0.7)) || 1;
    waves.push({ kx, ky, a: 1 / (1 + Math.hypot(kx, ky)) ** 1.15, p: rnd() * Math.PI * 2 });
  }
  const TAU = Math.PI * 2;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let dx = 0, dy = 0;
      for (const w of waves) {
        const ph = TAU * (w.kx * x + w.ky * y) / N + w.p;
        const c0 = Math.cos(ph) * w.a * TAU / N;
        dx += c0 * w.kx; dy += c0 * w.ky;
      }
      const s = 9;
      let nx = -dx * s, ny = -dy * s, nz = 1;
      const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const i = (y * N + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function mountains(THREE) {
  const group = new THREE.Group();
  const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y) => { let f = 0, a = 0.5; for (let i = 0; i < 5; i++) { f += a * noise(x, y); x *= 2.02; y *= 2.02; a *= 0.5; } return f; };
  const range = (w, d, H, seed, pos, color) => {
    const g = new THREE.PlaneGeometry(w, d, 120, 30);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const nx = x / w + 0.5, nz = z / d + 0.5;
      const edge = Math.sin(Math.PI * nx) ** 0.6 * Math.sin(Math.PI * nz);
      const h = (fbm(x * 0.004 + seed, z * 0.004) * 1.4 - 0.35) * H * edge + Math.pow(fbm(x * 0.0015 + seed * 2, z * 0.0015), 2) * H * edge;
      p.setY(i, Math.max(-20, h));
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 1, metalness: 0 }));
    m.position.copy(pos);
    group.add(m);
  };
  range(4200, 700, 520, 3.3, new THREE.Vector3(-400, -10, -3400), '#3b3a4a');
  range(2600, 500, 330, 8.1, new THREE.Vector3(-1900, -10, -2300), '#46424e');
  range(2200, 420, 260, 1.7, new THREE.Vector3(1700, -10, -2500), '#4a4550');
  return group;
}

function buildScene(THREE, Water, Sky, el, onReady) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.55;
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 1, 20000);
  camera.position.set(0, 18, 120);

  const sun = new THREE.Vector3();
  const water = new Water(new THREE.PlaneGeometry(12000, 12000), {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: waterNormals(THREE),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xfff2dd,
    waterColor: 0x0b3a52,
    distortionScale: 3.2,
    fog: false,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  const sky = new Sky();
  sky.scale.setScalar(12000);
  scene.add(sky);
  const su = sky.material.uniforms;
  su.turbidity.value = 9;
  su.rayleigh.value = 2.2;
  su.mieCoefficient.value = 0.006;
  su.mieDirectionalG.value = 0.82;

  scene.add(mountains(THREE));
  scene.add(new THREE.HemisphereLight(0xffe2c4, 0x1d2a38, 0.9));
  const dirLight = new THREE.DirectionalLight(0xffc89a, 1.6);
  scene.add(dirLight);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  let envRT = null;
  const setSun = (elevation, azimuth) => {
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    su.sunPosition.value.copy(sun);
    water.material.uniforms.sunDirection.value.copy(sun).normalize();
    dirLight.position.copy(sun).multiplyScalar(1000);
    if (envRT) envRT.dispose();
    envScene.add(sky);
    envRT = pmrem.fromScene(envScene);
    scene.add(sky);
    scene.environment = envRT.texture;
  };
  setSun(4, 190);

  const resize = () => {
    const w = el.clientWidth || window.innerWidth, h = el.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 66 : 52;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  let mx = 0, my = 0, tx = 0, ty = 0;
  const onMove = (e) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onMove, { passive: true });

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(el);

  const clock = new THREE.Clock();
  let raf, lastSun = 0, first = true;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible || document.hidden) return;
    const t = clock.elapsedTime;
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    water.material.uniforms.time.value += dt * 0.55;
    camera.position.x = mx * 30;
    camera.position.y = 18 + Math.sin(t * 0.6) * 1.2 - my * 8;
    camera.lookAt(mx * 40, 12, -1000);
    if (t - lastSun > 1.5) { // sun drifts through golden hour (cheap: env rebuilt every 1.5s)
      lastSun = t;
      setSun(3 + Math.sin(t * 0.05) * 2.5, 190 + Math.sin(t * 0.03) * 12);
    }
    renderer.render(scene, camera);
    if (first) { first = false; onReady(); }
  };
  loop();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    envRT?.dispose();
    pmrem.dispose();
    water.geometry.dispose();
    water.material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
