/* Service Worker — Brújula de Negocio
   Cache-first para el shell, con auto-actualización. */
const VERSION = 'v1.0.0';
const CACHE = 'brujula-' + VERSION;

const SHELL = [
  './', './index.html', './styles.css', './data.js', './app.js',
  './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png',
  './icon-maskable-512.png', './apple-touch-icon.png', './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        (await caches.open(CACHE)).put('./index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('./index.html')) || (await caches.match('./')) ||
               new Response('Sin conexión', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) {
      fetch(req).then(r => { if (r?.ok) caches.open(CACHE).then(c => c.put(req, r)); }).catch(() => {});
      return hit;
    }
    try {
      const res = await fetch(req);
      if (res?.ok) (await caches.open(CACHE)).put(req, res.clone());
      return res;
    } catch { return new Response('', { status: 504 }); }
  })());
});
