const CACHE_NAME = "v1"; // Define your cache name
const urlsToCache = [
  "/", // The root URL
  "/index.html", // Your main HTML file
  "/style.css", // Your CSS file
  "/script.js", // Your JavaScript file
  "/firebase-config.js", // Firebase config
  "/manifest.json", // Web app manifest
  "/images/icon-192.png", // Icon
  "/images/icon-512.png", // Icon
];

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return Promise.all(
        urlsToCache.map((url) => {
          console.log(`Caching: ${url}`);
          return cache.add(url).catch((error) => {
            console.error(`Failed to cache: ${url}`, error);
          });
        })
      );
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
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached content, fallback to network if unavailable
self.addEventListener("fetch", (event) => {
  console.log(`Fetching: ${event.request.url}`);

  // Exclude Google Analytics from caching
  if (event.request.url.includes("google-analytics.com")) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.error("Failed to fetch Google Analytics:", error);
        return new Response(null, { status: 204 }); // No Content response
      })
    );
    return; // Exit early to prevent further handling
  }

  // Only cache GET requests
  if (event.request.method === "GET") {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          if (response) {
            console.log(`Serving cached response for: ${event.request.url}`);
            return response; // Return the cached response
          }

          console.log(`Fetching from network: ${event.request.url}`);
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }
            return networkResponse;
          });
        })
        .catch((error) => {
          console.error("Fetch failed; returning offline page instead.", error);
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
    );
  } else {
    // Handle non-GET requests directly
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Check if the response is okay
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const clonedResponse = response.clone();
          const newHeaders = new Headers(response.headers);
          newHeaders.set("Access-Control-Allow-Origin", "*"); // Allow all origins

          return new Response(clonedResponse.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        })
        .catch((error) => {
          console.error("Fetch failed for non-GET request:", error);
          // Optionally return a fallback response or handle errors
          return new Response("Error fetching resource", { status: 500 });
        })
    );
  }
});
