'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    if (! await pageIsFunctional()) {
        window.location.href = 'index.html';
    }
    document.querySelector('#search-button').addEventListener('click', searchBook);
    document.querySelector('form').addEventListener('submit', addBook);
}

async function pageIsFunctional() {
    return await getUidFromLocalForage();
}

function deleteDynamicHtml() {
    const $book = document.querySelector('#book');
    if ($book) $book.remove();
    const $err = document.querySelector('#error');
    if ($err) $err.remove();
}

function setPage(bookWasFound) {
    deleteDynamicHtml();
    if (bookWasFound) {
        document.querySelector('#add-button').classList.remove('hidden');
    } else {
        document.querySelector('#add-button').classList.add('hidden');        
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

async function postBook() {
    const uid = await getUidFromLocalForage();
    const $isbn = document.querySelector('#isbn').value;
    return fetch(`${config.minervaBaseUrl}/users/${uid}/books`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ isbn: $isbn })
    });
}

async function addBook(evt) {
    evt.preventDefault();
    const res = await postBook();
    if (res.status === 201) {
        window.location.href = 'books.html'
    } else if (res.status === 409) {
        const err = await res.json();
        displayErrMsg(err.message);
    }
}

function displayErrMsg(errMsg, afterSearch) {
    const errHtml = `<p id="error">${errMsg}</p>`;
    if (afterSearch) {
        document.querySelector('#search-button').insertAdjacentHTML('afterend', errHtml);
    } else {
        document.querySelector('#add-button').insertAdjacentHTML('afterend', errHtml);
    }
}
