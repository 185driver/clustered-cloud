/* eslint-disable no-undef, no-underscore-dangle, no-restricted-globals */

self.addEventListener('message', (e) => {
  if (!e.data) {
    return;
  }

  switch (e.data) {
    case 'skipWaiting':
      self.skipWaiting();
      break;
    default:
      // NOOP
      break;
  }
});

// Cleans up old precached data.
workbox.precaching.cleanupOutdatedCaches();

// Prefixes the cache name in the Dev Tools Cache Storage viewer.
workbox.core.setCacheNameDetails({ prefix: 'clustered-cloud' });

// Throws promise error in dev tools console if placed inside switch() above
// as 'self.clients.claim()'. Works quite nicely here, however.
workbox.core.clientsClaim();

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
