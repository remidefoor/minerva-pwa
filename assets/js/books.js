'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
    displayBooks();
    document.querySelector('#search-bar').addEventListener('keyup', filterBooks);
}

async function getBooks() {
    const uid = await getUidFromLocalForage();
    return fetch(`${config.minervaBaseUrl}/users/${uid}/books`);
}

function getBookVolume(isbn) {
    const url = `${config.googleBooksBaseUrl}${isbn}`;  // &key=${config.googleBooksApikey}
    return fetch(url);
}

function getBookNode(bookInfo) {
    const article = document.createElement('article');
    const innerHtml =  `
        <img src="${bookInfo.imageLinks.thumbnail}" alt="${bookInfo.title} book cover" />
        <h1>${bookInfo.title}</h1>
    `;
    article.innerHTML = innerHtml;
    return article;
}

async function getBookNodes(books) {
    const bookNodes = [];
    for (const book of books) {
        const bookVolume = await (await getBookVolume(book.ISBN)).json();
        const bookInfo = bookVolume.items[0].volumeInfo;
        bookNodes.push(getBookNode(bookInfo));
    }
    return bookNodes;
}

function getSortedBookNodes(bookNodes) {
    return bookNodes.sort((bookNode1, bookNode2) => {
        const title1 = bookNode1.lastElementChild.innerHTML;
        const title2 = bookNode2.lastElementChild.innerHTML;
        return title1 === title2 ? 0 : (title1 < title2 ? -1: 1) ;
    });
}

async function displayBooks() {
    const $bookContainer = document.querySelector('#books');
    const books = await (await getBooks()).json();
    const sortedBookNodes = getSortedBookNodes(await getBookNodes(books));
    for (const bookNode of sortedBookNodes) {
        $bookContainer.appendChild(bookNode);
    }
}

function filterBooks(evt) {

}
