const CACHE_NAME = "v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/firebase-config.js",
  "/manifest.json",
  "/images/icon-192.png",
  "/images/icon-512.png",
];

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event: Clean up old caches if the version changes
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content, fallback to network if unavailable
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("google-analytics.com")) {
    // Exclude external services like Google Analytics from being cached
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Serve cached response if available, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback if both cache and network fail
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      })
  );
});
