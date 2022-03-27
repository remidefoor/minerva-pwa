'use strict';

const config = {
    minervaBaseUrl: 'http://laravel.minerva.com/api',
    googleBooksApikey: 'AIzaSyDZIHMQYqgI6neWsQbQ5AdbTbfKmk5DuzM',
    googleBooksBaseUrl: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
}

const store = localforage.createInstance({
    name: 'minerva',
    version: 1
});

function getUidFromLocalForage() {
    return store.getItem('uid');
}

async function setUidInLocalStorage(uid) {
    store.setItem('uid', uid);
}
