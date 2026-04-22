const CACHE_NAME = 'adn-site-v1';
const CORE_ASSETS = [
  'index.html',
  'empresa.html',
  'servicios.html',
  'contacto.html',
  'cod_etico.html',
  'canal_denuncias.html',
  'styles/style.css',
  'styles/header_footer.css',
  'js/include.js',
  'js/header.js',
  'styles/img/ADNSBERT.png',
  'styles/img/ADNSBERTpwa192.png',
  'styles/img/ADNSBERTpwa512.png',
  'styles/img/index/banda1.webp',
  'styles/img/index/portada.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Permitir que la página solicite activación inmediata
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estrategia: network-first para HTML/CSS/JS (fuerza actualización), cache-first para imágenes y recursos estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  // Network-first for navigation and core assets (html, css, js)
  const isNavOrCore = req.destination === 'document' || req.mode === 'navigate' ||
    req.destination === 'script' || req.destination === 'style' ||
    url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js');

  if (isNavOrCore) {
    event.respondWith(
      fetch(req)
        .then((response) => {
          try {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          } catch (e) {}
          return response;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  // Cache-first for other resources (images, fonts, etc.)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((response) => {
          try {
            const resClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          } catch (e) {}
          return response;
        })
        .catch(() => {});
    })
  );
});
