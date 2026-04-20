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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // Guardar en cache la respuesta obtenida
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return response;
        })
        .catch(() => caches.match('index.html'));
    })
  );
});
