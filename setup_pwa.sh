#!/bin/bash

# Create manifest.json
cat > daily-tracker-pwa/public/manifest.json << MANIFEST
{
  "short_name": "Tracker",
  "name": "Daily Tracker PWA",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 24x24 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "logo512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#FFD700",
  "background_color": "#000000"
}
MANIFEST

# Create service-worker.js
cat > daily-tracker-pwa/public/service-worker.js << SW
const CACHE_NAME = 'daily-tracker-cache-v2';
const urlsToCacheOnInstall = [ '/', '/index.html', '/manifest.json', '/favicon.ico', '/logo192.png', '/logo512.png' ];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCacheOnInstall))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});
SW

# Update index.js
cat > daily-tracker-pwa/src/index.js << INDEX_JS
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered!', reg))
      .catch(err => console.log('SW registration failed: ', err));
  });
}
INDEX_JS
