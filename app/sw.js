const CACHE = 'minha-vida-v1';
const URLS = [
  'index.html',
  'manifest.json',
  'css/styles.css',
  'js/app.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
});

// Fetch
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(() => new Response('Offline', {status: 503})))
  );
});

// ===== NOTIFICATION SCHEDULING =====
// Listen for messages from the app to schedule notifications
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    const notifications = e.data.notifications || [];
    const now = Date.now();

    notifications.forEach(n => {
      const delay = n.time - now;
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // max 24h ahead
        self.registration.showNotification('⏰ ' + n.title, {
          body: n.body,
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-192.png',
          tag: 'routine-' + n.id,
          requireInteraction: true,
          vibrate: [200, 100, 200, 100, 200],
          data: { id: n.id, action: n.action }
        });
      }
    });
  }
});

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();

  // If notification has an action, notify the client
  if (e.notification.data && e.notification.data.action) {
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_ACTION',
          action: e.notification.data.action,
          id: e.notification.data.id
        });
      });
    });
  }

  // Open/focus the app
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('index.html');
    })
  );
});
