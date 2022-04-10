'use strict';

const config = {
    minervaBaseUrl: 'http://node.minerva.com:3000/api',
    googleBooksApikey: 'AIzaSyDZIHMQYqgI6neWsQbQ5AdbTbfKmk5DuzM',
    googleBooksBaseUrl: 'https://www.googleapis.com/books/v1/volumes?q=isbn:'
}


// reusable functions

// navigation
async function redirectWhenLoggedIn() {
    if (await getUidFromLocalForage()) window.location.href = 'books.html';
}

async function redirectWhenLoggedOff() {
    if (await getUidFromLocalForage() === null) window.location.href = 'index.html';
}

// local forage
const store = localforage.createInstance({
    name: 'minerva',
    version: 1
});

function getUidFromLocalForage() {
    return store.getItem('uid');
}

async function setUidInLocalForage(uid) {
    await store.setItem('uid', uid);
    window.location.href = 'books.html';
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
    const url = `${config.googleBooksBaseUrl}${isbn}`;  // &key=${config.googleBooksApikey} omitted due to request limit
    return fetch(url);
}

function getImgHtml(volumeInfo) {
    let imgSrc = 'assets/media/images/blank-book-cover.jpg';
    if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
        imgSrc = volumeInfo.imageLinks.thumbnail;
    }
    return `<img src="${imgSrc}" alt="${volumeInfo.title} book cover" />`;
}
