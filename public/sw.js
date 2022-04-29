'use strict';

const CACHE_NAME = 'minerva-v1';

self.addEventListener('install', async evt => {
    evt.waitUntil(await cacheUrls());
});

async function cacheUrls() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(getCachedUrls());
}

function getCachedUrls() {
    const GENERAL_URLS = [
        '/',
        '/assets/css/reset.css',
        '/assets/css/style.css',
        '/assets/js/lib/localforage.min.js',
        '/assets/js/script.js'
    ];
    const PWA_URLS = [
        '/sw.js',
        '/manifest.webmanifest'
    ];
    const LOG_IN_URLS = [
        'index.html',
        '/assets/css/auth.css',
        '/assets/js/index.js'
    ];
    const SIGN_UP_URLS = [
        'sign-up.html',
        '/assets/js/sign-up.js'
    ];
    const BOOKS_URLS = [
        'books.html',
        '/assets/css/books.css',
        '/assets/js/books.js'
    ];
    const ADD_BOOK_URLS = [
        'add-book.html',
        '/assets/css/add-book.css',
        '/assets/js/add-book.js'
    ];
    const NOTES_URLS = [
        'notes.html',
        '/assets/css/notes.css',
        '/assets/js/notes.js'
    ];
    const MEDIA_URLS = [
        '/assets/media/icons/add-box.svg',
        '/assets/media/icons/arrow-back.svg',
        '/assets/media/icons/book.svg',
        '/assets/media/icons/more-vert.svg',
        '/assets/media/icons/person.svg',
        '/assets/media/icons/photo-camera.svg',
        '/assets/media/icons/send.svg',
        '/assets/media/images/blank-book-cover.jpg'
    ];

    return [
        ...GENERAL_URLS,
        ...PWA_URLS,
        ...LOG_IN_URLS,
        ...SIGN_UP_URLS,
        ...BOOKS_URLS,
        ...ADD_BOOK_URLS,
        ...NOTES_URLS,
        ...MEDIA_URLS
    ];
}

self.addEventListener('fetch', evt => {  // TODO refactor with async await
    evt.respondWith(fetch(evt.request).catch(() => {
            return caches.open(CACHE_NAME).then(cache => cache.match(evt.request));
        })
    );
});

self.addEventListener('push', evt => {
    const notifcationData = evt.data.json();

    self.registration.showNotification(notifcationData.title, {
        body: notifcationData.body,
        icon: './pwa-icons/logo-light-128x128.png'
    });
});
