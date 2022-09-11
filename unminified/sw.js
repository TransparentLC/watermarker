const CACHE_NAME = 'akarin-watermarker-1662906897229';

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll([
            '.',
            'app.js',
            'sample.avif',
            'sample.webp',
            'watermark.webp',
            'icon-256px.png',
            'icon-1024px.png',
            'iconr-256px.png',
            'iconr-1024px.png',
            'https://cdn.jsdelivr.net/npm/mdui@1/dist/css/mdui.min.css',
            'https://cdn.jsdelivr.net/combine/npm/petite-vue@0.4/dist/petite-vue.iife.js,npm/mdui@1/dist/js/mdui.min.js',
            'https://cdn.jsdelivr.net/npm/mdui@1/dist/icons/material-icons/MaterialIcons-Regular.woff2',
            'https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-Regular.woff2',
            'https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-RegularItalic.woff2',
            'https://cdn.jsdelivr.net/npm/mdui@1/dist/fonts/roboto/Roboto-Medium.woff2',
        ]))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});