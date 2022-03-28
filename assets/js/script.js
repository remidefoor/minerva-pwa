'use strict';

const config = {
    minervaBaseUrl: 'http://laravel.minerva.com/api',
    googleBooksApikey: 'AIzaSyDZIHMQYqgI6neWsQbQ5AdbTbfKmk5DuzM',
    googleBooksBaseUrl: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
}


// reusable functions

const store = localforage.createInstance({
    name: 'minerva',
    version: 1
});

function getUidFromLocalForage() {
    return store.getItem('uid');
}

async function setUidInLocalForage(uid) {
    store.setItem('uid', uid);
}

function getBookVolume(isbn) {
    const url = `${config.googleBooksBaseUrl}${isbn}`;  // &key=${config.googleBooksApikey}
    return fetch(url);
}

function getImgHtml(volumeInfo) {
    let imgSrc = 'assets/media/images/blank_book_cover.jpg';
    if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
        imgSrc = volumeInfo.imageLinks.thumbnail;
    }
    return `<img src="${imgSrc}" alt="${volumeInfo.title} book cover" />`;
}
