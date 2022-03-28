'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    if (! await pageIsFunctional()) {
        window.location.href = 'index.html';
    }
    document.querySelector('#search-button').addEventListener('click', searchBook)
}

async function pageIsFunctional() {
    return await getUidFromLocalForage();
}

function deleteSearchResult() {
    const $book = document.querySelector('#book');
    if ($book) $book.remove();
}

function setPage(bookWasFound) {
    deleteSearchResult();
    const $isbn = document.querySelector('#isbn');
    const $addButton = document.querySelector('#add-button');
    if (bookWasFound) {
        $isbn.value = '';
        $addButton.classList.remove('hidden');
    } else {
        $isbn.focus();
        $addButton.classList.add('hidden');        
    }
}

function getAuthorsNode(auhtors) {
    const ul = document.createElement('ul');
    auhtors.forEach(author => {
        ul.insertAdjacentHTML('beforeend', `<li>${author}</li>`)
    });
    return ul;
}

function getBookNode(volumeInfo) {
    const article = document.createElement('article');
    article.id = 'book'
    const innerHTML = `
        <img src="${volumeInfo.imageLinks.thumbnail}" alt="${volumeInfo.title} book cover" />

        <h2>Title:</h2>
        <p>${volumeInfo.title}</p>

        <h2>Authors:</h2>
    `;
    article.insertAdjacentHTML('beforeend', innerHTML);
    article.appendChild(getAuthorsNode(volumeInfo.authors));
    return article;
}

function displaySearchResult(volumeInfo) {
    setPage(true);
    document.querySelector('#search-button').insertAdjacentElement('afterend', getBookNode(volumeInfo));
}

async function searchBook(evt) {
    const $isbn = document.querySelector('#isbn').value;
    const bookVolume = await (await getBookVolume($isbn)).json();
    if (bookVolume.totalItems > 0) {
        displaySearchResult(bookVolume.items[0].volumeInfo)
    } else {
        setPage(false);
    }
}
