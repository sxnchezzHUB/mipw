const CACHE_NAME = 'gamer-phones-v1';
// sw.js
const urlsToCache = [
  './',
  './index.html',
  './app.js',
  './manifest.json'
];

// 1. Durante la instalación, guardamos los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en caché');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Interceptamos las peticiones (Caché Dinámico)
self.addEventListener('fetch', event => {
  // Ignoramos peticiones que no sean GET (como el POST de Chrome extensions)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. Si el archivo ya está en el caché, lo devolvemos inmediatamente
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. Si no está en el caché, lo vamos a buscar a internet (red)
        return fetch(event.request).then(networkResponse => {
          // Si la respuesta de red es válida, guardamos una copia en el caché dinámico
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone(); // Clonamos porque la respuesta solo se puede usar una vez
            
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          
          return networkResponse;
        }).catch(() => {
          // 3. Opcional: Qué hacer si falla la red y no hay caché (ej. mostrar una página offline genérica)
          console.warn('Sin conexión y recurso no cacheado:', event.request.url);
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});


// Escuchar el evento de sincronización
self.addEventListener('sync', event => {
  if (event.tag === 'mi-primer-sync') {
    console.log('Sincronización detectada en el Service Worker');
    
    event.waitUntil(
      // Simulamos que tarda 3 segundos en enviar los datos al servidor
      new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
        return self.registration.showNotification('¡Catálogo Actualizado!', {
          body: 'Tus teléfonos gamer favoritos se guardaron correctamente.',
          // icon: 'https://dummyimage.com/192x192/121212/00d2ff.png&text=Gamer',
          vibrate: [200, 100, 200]
        });
      })
    );
  }
});