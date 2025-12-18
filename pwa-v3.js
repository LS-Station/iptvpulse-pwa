(function() {
  'use strict';

  // 1. SEO & Homepage Check (Super Fast)
  // If user is NOT on homepage, stop everything immediately.
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    return;
  }

  // 2. Styles (Premium & Lightweight)
  var s = document.createElement('style');
  s.innerHTML = `
    #pwa-btn {
      display: none;
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 13px;
      border-radius: 50px;
      font-family: Arial, sans-serif;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      cursor: pointer;
      transition: transform 0.2s;
    }
    #pwa-btn:hover { transform: scale(1.05); }
  `;
  document.head.appendChild(s);

  // 3. Create Button
  var b = document.createElement('button');
  b.id = 'pwa-btn';
  b.innerText = 'IPTVPulse App';
  document.body.appendChild(b);

  // 4. Dynamic Manifest (SEO Friendly Link)
  var m = {
    "name": "IPTV Pulse",
    "short_name": "IPTVPulse",
    "start_url": window.location.href + "?utm_source=pwa_app",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {"src":"https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-192.png","sizes":"192x192","type":"image/png"},
      {"src":"https://cdn.jsdelivr.net/gh/LS-Station/iptvpulse-pwa@main/icon-512.png","sizes":"512x512","type":"image/png"}
    ]
  };
  var l = document.createElement('link');
  l.rel = 'manifest';
  l.href = URL.createObjectURL(new Blob([JSON.stringify(m)], {type: 'application/json'}));
  document.head.appendChild(l);

  // 5. Service Worker (Performance Booster)
  if ('serviceWorker' in navigator) {
    var sc = "self.addEventListener('install', e=>self.skipWaiting());self.addEventListener('activate', e=>self.clients.claim());self.addEventListener('fetch', e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));";
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([sc], {type: 'text/javascript'})), {scope: '/'});
  }

  // 6. Install Logic & Analytics Trigger
  var p;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    p = e;
    b.style.display = 'block';
  });

  b.addEventListener('click', () => {
    b.style.display = 'none';
    if (p) { 
      p.prompt(); 
      p.userChoice.then((res) => {
        if (res.outcome === 'accepted') {
          // GA4 Tracking
          if (typeof gtag !== 'undefined') {
            gtag('event', 'app_installed', { 'event_category': 'PWA', 'event_label': 'Button Click' });
          }
        }
        p = null;
      });
    }
  });

  window.addEventListener('appinstalled', () => {
    b.style.display = 'none';
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_installed_success', { 'event_category': 'PWA', 'event_label': 'Success' });
    }
  });

})();
