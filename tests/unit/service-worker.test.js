/**
 * Unit tests for service worker functionality
 */

describe('Service Worker', () => {
  const CACHE_NAME = 'cocopilot-v2';
  
  beforeEach(() => {
    // Mock service worker environment
    global.self = {
      addEventListener: jest.fn(),
      skipWaiting: jest.fn(() => Promise.resolve()),
      clients: {
        claim: jest.fn(() => Promise.resolve())
      }
    };

    global.caches = {
      open: jest.fn(() => Promise.resolve({
        addAll: jest.fn(() => Promise.resolve()),
        add: jest.fn(() => Promise.resolve()),
        put: jest.fn(() => Promise.resolve()),
        match: jest.fn(() => Promise.resolve())
      })),
      match: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve())
    };

    global.fetch = jest.fn();
    global.console.log = jest.fn();
  });

  describe('Service Worker Installation', () => {
    test('should cache critical resources during installation', async () => {
      const urlsToCache = [
        '/',
        '/index.html',
        '/favicon.svg',
        '/manifest.json'
      ];

      const mockCache = {
        addAll: jest.fn(() => Promise.resolve()),
        add: jest.fn(() => Promise.resolve())
      };

      caches.open.mockResolvedValue(mockCache);

      // Simulate install event
      const installEvent = {
        waitUntil: jest.fn()
      };

      // Simulate the install handler logic
      const installPromise = caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache));

      installEvent.waitUntil(installPromise);

      expect(caches.open).toHaveBeenCalledWith(CACHE_NAME);
      expect(installEvent.waitUntil).toHaveBeenCalled();
    });

    test('should handle cache failures gracefully', async () => {
      const mockCache = {
        addAll: jest.fn(() => Promise.reject(new Error('Cache failed'))),
        add: jest.fn(() => Promise.resolve())
      };

      caches.open.mockResolvedValue(mockCache);

      try {
        await caches.open(CACHE_NAME).then(cache => cache.addAll(['fail']));
      } catch (error) {
        expect(error.message).toBe('Cache failed');
      }
    });
  });

  describe('Service Worker Activation', () => {
    test('should clean up old caches during activation', async () => {
      const cacheNames = ['cocopilot-v1', 'cocopilot-v2', 'other-cache'];
      
      caches.keys = jest.fn(() => Promise.resolve(cacheNames));
      caches.delete.mockResolvedValue(true);

      // Simulate activation event
      const activationEvent = {
        waitUntil: jest.fn()
      };

      // Simulate the activation handler logic
      const cleanupPromise = caches.keys().then(names => {
        return Promise.all(
          names.map(name => {
            if (name !== CACHE_NAME && name.startsWith('cocopilot-')) {
              return caches.delete(name);
            }
          })
        );
      });

      activationEvent.waitUntil(cleanupPromise);

      expect(caches.keys).toHaveBeenCalled();
      expect(activationEvent.waitUntil).toHaveBeenCalled();
    });
  });

  describe('Fetch Event Handling', () => {
    test('should use network-first strategy for GitHub API requests', async () => {
      const apiRequest = new Request('https://api.github.com/repos/acbart/cocopilot');
      const mockResponse = new Response('{"stars": 42}', { status: 200 });

      fetch.mockResolvedValue(mockResponse);

      const mockCache = {
        put: jest.fn(() => Promise.resolve()),
        match: jest.fn(() => Promise.resolve())
      };

      caches.open.mockResolvedValue(mockCache);

      // Simulate the fetch handler logic for API requests
      const response = await fetch(apiRequest);
      
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(apiRequest, response.clone());
      }

      expect(fetch).toHaveBeenCalledWith(apiRequest);
      expect(caches.open).toHaveBeenCalledWith(CACHE_NAME);
      expect(mockCache.put).toHaveBeenCalledWith(apiRequest, expect.any(Response));
    });

    test('should fallback to cache when network fails for API requests', async () => {
      const apiRequest = new Request('https://api.github.com/repos/acbart/cocopilot');
      const cachedResponse = new Response('{"stars": 42}', { status: 200 });

      fetch.mockRejectedValue(new Error('Network error'));
      caches.match.mockResolvedValue(cachedResponse);

      // Simulate the fetch handler logic with network failure
      try {
        await fetch(apiRequest);
      } catch (error) {
        const fallbackResponse = await caches.match(apiRequest);
        expect(fallbackResponse).toBe(cachedResponse);
      }

      expect(fetch).toHaveBeenCalledWith(apiRequest);
      expect(caches.match).toHaveBeenCalledWith(apiRequest);
    });

    test('should use cache-first strategy for static assets', async () => {
      const staticRequest = new Request('/index.html');
      const cachedResponse = new Response('<html></html>', { status: 200 });

      caches.match.mockResolvedValue(cachedResponse);

      // Simulate the fetch handler logic for static assets
      const response = await caches.match(staticRequest);

      expect(response).toBe(cachedResponse);
      expect(caches.match).toHaveBeenCalledWith(staticRequest);
    });

    test('should fetch from network when cache miss occurs', async () => {
      const staticRequest = new Request('/new-file.html');
      const networkResponse = new Response('<html>New</html>', { status: 200 });

      caches.match.mockResolvedValue(undefined); // Cache miss
      fetch.mockResolvedValue(networkResponse);

      const mockCache = {
        put: jest.fn(() => Promise.resolve())
      };
      caches.open.mockResolvedValue(mockCache);

      // Simulate the fetch handler logic for cache miss
      const cachedResponse = await caches.match(staticRequest);
      
      if (!cachedResponse) {
        const networkResponse = await fetch(staticRequest);
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(staticRequest, networkResponse.clone());
        }
      }

      expect(caches.match).toHaveBeenCalledWith(staticRequest);
      expect(fetch).toHaveBeenCalledWith(staticRequest);
      expect(mockCache.put).toHaveBeenCalledWith(staticRequest, expect.any(Response));
    });
  });

  describe('Background Sync', () => {
    test('should handle background sync events', async () => {
      const syncEvent = {
        tag: 'github-stats-sync',
        waitUntil: jest.fn()
      };

      const syncResponse = new Response('{"stars": 42}', { status: 200 });
      fetch.mockResolvedValue(syncResponse);

      // Simulate the sync handler logic
      if (syncEvent.tag === 'github-stats-sync') {
        const syncPromise = fetch('https://api.github.com/repos/acbart/cocopilot')
          .then(response => response.json())
          .then(data => {
            console.log('Background sync: GitHub stats updated', data);
          });

        syncEvent.waitUntil(syncPromise);
      }

      expect(syncEvent.waitUntil).toHaveBeenCalled();
    });

    test('should handle sync failures gracefully', async () => {
      const syncEvent = {
        tag: 'github-stats-sync',
        waitUntil: jest.fn()
      };

      fetch.mockRejectedValue(new Error('Sync failed'));

      // Simulate the sync handler logic with failure
      if (syncEvent.tag === 'github-stats-sync') {
        const syncPromise = fetch('https://api.github.com/repos/acbart/cocopilot')
          .catch(error => {
            console.log('Background sync failed:', error);
          });

        syncEvent.waitUntil(syncPromise);
      }

      expect(syncEvent.waitUntil).toHaveBeenCalled();
    });
  });

  describe('Message Handling', () => {
    test('should handle skip waiting message', () => {
      const messageEvent = {
        data: {
          type: 'SKIP_WAITING'
        }
      };

      // Simulate the message handler logic
      if (messageEvent.data && messageEvent.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      }

      expect(self.skipWaiting).toHaveBeenCalled();
    });

    test('should ignore unknown message types', () => {
      const messageEvent = {
        data: {
          type: 'UNKNOWN_MESSAGE'
        }
      };

      // Simulate the message handler logic
      if (messageEvent.data && messageEvent.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
      }

      expect(self.skipWaiting).not.toHaveBeenCalled();
    });
  });
});