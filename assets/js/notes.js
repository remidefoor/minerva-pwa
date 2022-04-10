'use strict';

document.addEventListener('DOMContentLoaded', init);

async function init(evt) {
    await redirectWhenLoggedOff();
    if (!(await pageIsFunctional())) window.location.href = 'books.html'
    await displayNotes(); // await because new notes can only be added after existing notes in the DOM
    document.querySelector('form').addEventListener('submit', addNote);
}

async function pageIsFunctional() {
    const uid = await getUidFromLocalForage();
    return uid && localStorage && localStorage.getItem('isbn');
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

function createNoteNode(noteId, note) {
    const noteNode = document.createElement('p');
    noteNode.innerHTML = note;
    noteNode.dataset.id = noteId;
    return noteNode;
}

async function displayNotes() {
    if (await pageIsFunctional()) {
        const uid = await getUidFromLocalForage();
        const isbn = localStorage.getItem('isbn');
        displayBookTitle(isbn);
        const $noteContainer = document.querySelector('#notes');
        const notes = await (await getNotes(uid, isbn)).json();
        for (const note of notes) {
            $noteContainer.appendChild(createNoteNode(note.id, note.note));
        }
    }
}

function postNote(uid, isbn, note) {
    return fetch(`${config.minervaBaseUrl}/users/${uid}/books/${isbn}/notes`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 'note': note })
    });
}

async function addNote(evt) {
    evt.preventDefault();
    if (await pageIsFunctional()) {
        const $note = document.querySelector('#note');
        const uid = await getUidFromLocalForage()
        const isbn = localStorage.getItem('isbn');
        const res = await postNote(uid, isbn, $note.value);
        if (res.status === 201) {
            const note = await res.json();
            document.querySelector('#notes').appendChild(createNoteNode(note.id, $note.value));
            $note.value = '';
        }
    }
}
