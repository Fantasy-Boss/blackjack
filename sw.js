const cacheName = 'blackjack-v1';
const staticAssets = [
    '/blackjack',
    'index.html',
    'manifest.webmanifest',
    'assets/style/bootstrap.min.css',
    'assets/style/bootstrap.min.css.map',
    'assets/style/style.css',
    'assets/script/script.js',
    'assets/sounds/cardSwish.mp3',
    'assets/sounds/draw.mp3',
    'assets/sounds/lose.mp3',
    'assets/sounds/win.mp3',
    'assets/images/2.png',
    'assets/images/3.png',
    'assets/images/4.png',
    'assets/images/5.png',
    'assets/images/6.png',
    'assets/images/7.png',
    'assets/images/8.png',
    'assets/images/9.png',
    'assets/images/10.png',
    'assets/images/A.png',
    'assets/images/J.png',
    'assets/images/K.png',
    'assets/images/Q.png',
    'assets/images/board.png',
    'assets/images/icon.png',
    'assets/images/icon-96.png',
    'assets/images/icon-256.png',
    'assets/images/icon-512.png',
];

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});


self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
            .filter(key => key !== cacheName)
            .map(key => caches.delete(key))
            );
        })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request)
        })
    )
});




