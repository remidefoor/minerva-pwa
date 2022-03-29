'use strict';

const CACHE_NAME = 'minerva-v1';

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
        '/assets/css/auth.css',
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
        '/assets/media/icons/add_box.svg',
        '/assets/media/icons/arrow_back.svg',
        '/assets/media/icons/book.svg',
        '/assets/media/icons/more-vert.svg',
        '/assets/media/icons/person.svg',
        '/assets/media/icons/photo_camera.svg',
        '/assets/media/icons/send.svg',
        '/assets/media/images/blank_book_cover.jpg'
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

console.log(getCachedUrls());
