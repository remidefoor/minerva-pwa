'use strict';

document.addEventListener('DOMContentLoaded', init);

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
    }
}

function init(evt) {
    registerServiceWorker
    document.querySelector('form').addEventListener('submit', createUser);
}

function resetPwdFields() {
    document.querySelector('#password').value = '';
    document.querySelector('#confirmed-password').value = '';
}

function displayErrs(errs) {
    const $errs = document.querySelector('#errors');
    $errs.innerHTML = '';

    errs.forEach(err => {
        $errs.insertAdjacentHTML('beforeend', `<li>${err}</li>`);
    });

    resetPwdFields();
}

function pwdsAreEqual() {
    const $pwd = document.querySelector('#password').value;
    const $confirmedPwd = document.querySelector('#confirmed-password').value;
    return $pwd === $confirmedPwd;
}

function getPostBody() {
    const $email = document.querySelector('#email').value;
    const $pwd = document.querySelector('#password').value;
    return {
        email: $email,
        password: $pwd
    }
}

function postUser() {
    return fetch(`${config.minervaBaseUrl}/users`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(getPostBody())
    });
}

async function createUser(evt) {
    evt.preventDefault();
    if (pwdsAreEqual()) {
        const res = await postUser();
        const userInfo = await res.json();
        if (res.status === 201) {
            await setUidInLocalForage(userInfo.id);
            window.location.href = 'books.html';
        } else if (res.status === 400) {
            displayErrs(userInfo.errors);
        }
    } else {
        displayErrs(['The provided passwords did not match.']);
    }
}
