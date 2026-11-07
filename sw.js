/* Service worker for Rongrong1314520's personal site.
   Network-first so published updates always show up when online,
   with a cache fallback so the installed app still opens offline. */
const CACHE = 'rongrong-v1';
const CORE = ['/papermod-preview/', '/papermod-preview/index.html', '/papermod-preview/photo.png', '/papermod-preview/manifest.json', '/papermod-preview/icon-192.png', '/papermod-preview/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
