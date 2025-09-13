// CocoPilot Service Worker for enhanced offline functionality
const CACHE_NAME = 'cocopilot-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Assets that should be cached for performance but not critical for offline functionality
const OPTIONAL_CACHE = [
  'https://api.github.com/repos/acbart/cocopilot'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  console.log('CocoPilot Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('CocoPilot cache opened');

        // Cache critical resources
        const cachePromise = cache.addAll(urlsToCache);

        // Cache optional resources (don't fail if they're not available)
        const optionalCachePromise = OPTIONAL_CACHE.map(url => {
          return cache.add(url).catch(error => {
            console.log('Optional cache failed for:', url, error);
          });
        });

        return Promise.all([cachePromise, ...optionalCachePromise]);
      })
      .then(() => {
        console.log('CocoPilot Service Worker: Installation complete');
        // Immediately activate the new service worker
        return self.skipWaiting();
      })
  );
});

// Fetch event - serve cached content with network-first strategy for API calls
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);

  // Handle GitHub API requests with network-first strategy
  if (requestUrl.hostname === 'api.github.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available
        if (response) {
          console.log('Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise, fetch from network and cache the response
        return fetch(event.request)
          .then(function(response) {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', function(event) {
  console.log('CocoPilot Service Worker: Activating...');

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('CocoPilot Service Worker: Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Handle background sync for offline actions (if supported)
self.addEventListener('sync', function(event) {
  if (event.tag === 'github-stats-sync') {
    event.waitUntil(
      // Attempt to fetch fresh GitHub stats when connection is restored
      fetch('https://api.github.com/repos/acbart/cocopilot')
        .then(response => response.json())
        .then(data => {
          console.log('Background sync: GitHub stats updated', data);
        })
        .catch(error => {
          console.log('Background sync failed:', error);
        })
    );
  }
});

// Send updates to clients when new content is available
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});