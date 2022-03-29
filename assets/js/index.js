'use strict';

document.addEventListener('DOMContentLoaded', init);

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
    }
}

async function init(evt) {
    await redirectWhenLoggedIn();
    registerServiceWorker();
    document.querySelector('form').addEventListener('submit', logIn);
}

async function logIn(evt) {
    evt.preventDefault();
    const res = await postLogin();
    const json = await res.json();
    if (res.status === 200) {
        await processUid(json.id);
    } else if (res.status === 400) {
        displayAuthErrs(json.errors);
    } else if (res.status === 403) {
        displayAuthErrs([json.message]);
    }
    resetForm();
}

function postLogin() {
    return fetch(`${config.minervaBaseUrl}/users/log-in`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(getUserPostBody())
    });
}

function resetForm() {
    document.querySelector('#email').value = '';
    document.querySelector('#password').value = '';
}
