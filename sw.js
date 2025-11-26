const CACHE_NAME = 'iptvpulse-cache-v1';
const urlsToCache = [
  '/',
  '/icon-192.png',
  '/icon-512.png'
];

// ইনস্টল করার সময় ক্যাশ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// নেটওয়ার্ক ফার্স্ট স্ট্র্যাটেজি (যাতে সব সময় নতুন কন্টেন্ট পায়)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});