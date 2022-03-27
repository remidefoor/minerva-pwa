'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    await displayBooks();
    document.querySelector('#search-bar').addEventListener('keyup', filterBooks);
}

async function getBooks() {
    const uid = await getUidFromLocalForage();
    return fetch(`${config.minervaBaseUrl}/users/${uid}/books`);
}

function getBookNode(bookInfo, isbn) {
    const article = document.createElement('article');
    article.dataset.isbn = isbn;
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
        bookNodes.push(getBookNode(bookInfo, book.ISBN));
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
    if (await getUidFromLocalForage()) {
        const $bookContainer = document.querySelector('#books');
        const books = await (await getBooks()).json();
        const sortedBookNodes = getSortedBookNodes(await getBookNodes(books));
        for (const bookNode of sortedBookNodes) {
            $bookContainer.appendChild(bookNode);
        }
        document.querySelector('img').addEventListener('click', navigateToNotesPage)
    }
}

function filterBooks(evt) {
    const $searchTerm = document.querySelector('#search-bar').value.toLowerCase();
    const $books = document.querySelectorAll('article');
    for (const book of $books) {
        const title = book.lastElementChild.innerHTML.toLowerCase();
        if (title.match($searchTerm)) {
            book.classList.remove('hidden');
        } else {
            book.classList.add('hidden');
        }
    }
}

function navigateToNotesPage(evt) {
    const isbn = evt.currentTarget.parentElement.dataset.isbn;
    if (localStorage) localStorage.setItem('isbn', isbn);
    window.location.href = 'notes.html';
}
