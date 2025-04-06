import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

declare let self: ServiceWorkerGlobalScope

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

// Clean up old caches
cleanupOutdatedCaches()

// Handle navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Enable navigation preload if available
      self.registration.navigationPreload?.enable(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.startsWith('workbox-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Handle navigation requests with preload
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to use navigation preload response if available
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Otherwise, use the network with cache fallback
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            const cache = await caches.open('pages-cache');
            await cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        } catch (error) {
          // If both preload and network fail, try to get from cache
          const cachedResponse = await caches.match('/index.html');
          if (cachedResponse) {
            return cachedResponse;
          }
        }

        // If all strategies fail, return a 404 page or fallback
        return new Response('Navigation failed', { status: 404 });
      })()
    );
  }
});

// Handle SPA navigation for non-navigate requests
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  allowlist: [new RegExp('^/$'), new RegExp('^/[^._]')],
  denylist: [new RegExp('\\.\\w+$')] // Exclude URLs ending with file extensions
})
registerRoute(navigationRoute)

// Cache static assets
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
)

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      })
    ]
  })
)

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
)

// Development-specific routes
const isDevelopment = process.env.NODE_ENV === 'development'
if (isDevelopment) {
  registerRoute(
    ({ url }) => {
      const devPaths = ['/@vite', '/@react-refresh', '/node_modules/.vite'];
      return devPaths.some(path => url.pathname.includes(path));
    },
    new NetworkFirst({
      cacheName: 'dev-resources',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  )
}

self.skipWaiting()
clientsClaim() 