'use strict';

const config = {
    minervaBaseUrl: 'http://laravel.minerva.com/api',
    googleBooksApikey: 'AIzaSyDZIHMQYqgI6neWsQbQ5AdbTbfKmk5DuzM',
    googleBooksBaseUrl: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
}


// reusable functions

// local forage
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

// auth
function getUserPostBody() {
    return {
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
    }
}

async function processUid(uid) {
    await setUidInLocalForage(uid);
    setTimeout(() => window.location.href = 'books.html', 1000);  // TODO find cleaner solution
}

function displayAuthErrs(errs) {
    const $errs = document.querySelector('#errors');
    $errs.innerHTML = '';

    errs.forEach(err => {
        $errs.insertAdjacentHTML('beforeend', `<li>${err}</li>`);
    });
}

// books
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
