'use strict';

let html5Qrcode;
let scanning;

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    await redirectWhenLoggedOff();
    html5Qrcode = new Html5Qrcode('scanner');
    document.querySelector('#search-button').addEventListener('click', searchBook);
    document.querySelector('#scan-button').addEventListener('click', startScanning);
    document.querySelector('#add-button').addEventListener('click', addBook);
}

async function pageIsFunctional() {
    return await getUidFromLocalForage() !== null;
}

function isValidIsbn(isbn) {
    if (isbn.length !== 10 && isbn.length !== 13) return false;
    for (const char of isbn) {
        if (isNaN(char)) return false;
    }
    return true;
}

function removeBook() {
    const $book = document.querySelector('#book');
    if ($book) $book.remove();
}

function removeErr() {
    const $err = document.querySelector('#error');
    if ($err) $err.remove();
}

function setPage(bookWasFound) {
    if (scanning) stopScanning();
    removeErr();
    removeBook();
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
        ${getImgHtml(volumeInfo)}

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
    document.querySelector('#scan-button').insertAdjacentElement('afterend', getBookNode(volumeInfo));
}

function displayError(errorMessage, afterAdd) {
    const errHtml = `<p id="error">${errorMessage}</p>`;
    if (afterAdd) {
        removeErr();
        document.querySelector('#add-button').insertAdjacentHTML('afterend', errHtml);
    } else {
        document.querySelector('#scan-button').insertAdjacentHTML('afterend', errHtml);
    }
}

function handleSearchError(errorMessage) {
    setPage(false);
    displayError(errorMessage, false);
}

async function searchBook(evt) {
    const $isbn = document.querySelector('#isbn').value;
    if (isValidIsbn($isbn)) {
        const bookVolume = await (await getBookVolume($isbn)).json();
        if (bookVolume.totalItems > 0) {
            displaySearchResult(bookVolume.items[0].volumeInfo)
        } else {
            handleSearchError('The requested book was not found.');
        }
    } else {
        handleSearchError('The provided ISBN is invalid. A valid ISBN is a number consisting of 10 or 13 digits.');
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
        body: JSON.stringify({ ISBN: $isbn })
    });
}

async function addBook(evt) {
    evt.preventDefault();
    if (await pageIsFunctional()) {
        const res = await postBook();
        if (res.status === 201) {
            window.location.href = 'books.html'
        } else if (res.status === 409) {
            const err = await res.json();
            displayError(err.message, true);
        }
    }
}


// scanner

async function startScanning() {
    if (!scanning) {
        try {
            const cameraId = (await getCameras())[0].id;
            await html5Qrcode.start(
                    cameraId,
                    {
                        fps: 10
                    },
                    processCode,
                    errorMessage => {}
                );
            setPage(false);
            scanning = true;
        } catch (ex) {
            handleSearchError(ex);
        }
    }
}

async function getCameras() {
    const cameras = await Html5Qrcode.getCameras();
    if (!cameras || !cameras.length) throw new Error('The device has no available cameras.');
    return cameras;
}

async function processCode(code) {
    await stopScanning();
    document.querySelector('#isbn').value = code
    searchBook();
}

async function stopScanning() {
    try {
        await html5Qrcode.stop();
        scanning = false;
    } catch (ex) {
        handleSearchError(ex);
    }
}
