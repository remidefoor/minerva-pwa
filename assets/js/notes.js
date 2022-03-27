'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    await displayNotes();
}

async function displayBookTitle(isbn) {
    const bookVolume = await (await getBookVolume(isbn)).json();
    const volumeInfo = bookVolume.items[0].volumeInfo;
    const title = `<h1>${volumeInfo.title}</h1>`;
    document.querySelector('#back').insertAdjacentHTML('afterend', title);
}

function getNotes(uid, isbn) {
    return fetch(`${config.minervaBaseUrl}/users/${uid}/books/${isbn}/notes`);
}

function createNoteNode(note) {
    const noteNode = document.createElement('p');
    noteNode.innerHTML = note.note;
    noteNode.dataset.id = note.id;
    return noteNode;
}

async function displayNotes() {
    const uid = await getUidFromLocalForage();
    if (uid && localStorage && localStorage.getItem('isbn')) {
        const isbn = localStorage.getItem('isbn');
        displayBookTitle(isbn);
        const $noteContainer = document.querySelector('#notes');
        const notes = await (await getNotes(uid, isbn)).json();
        for (const note of notes) {
            $noteContainer.appendChild(createNoteNode(note));
        }
    }
}