/**
 * Minimal service worker — required by Chrome/Android for the app to be
 * considered "installable" (the `beforeinstallprompt` event only fires
 * when an active service worker with a fetch handler is registered).
 *
 * This is intentionally a pass-through network fetcher, not an offline
 * cache: the platform deals in live financial data (wallet balances,
 * commissions, binary tree state), so serving stale cached responses
 * would be actively harmful. If offline support is wanted later, add a
 * cache-first strategy for static assets only (never API responses).
 */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
