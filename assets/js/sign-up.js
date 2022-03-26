'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
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

async function postUser() {
    return await fetch(`${config.baseUrl}/users`, {
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
        const json = await res.json();
        if (res.status === 201) {
            console.log(json.id);
            window.location.href = 'books.html';
        } else if (res.status === 400) {
            displayErrs(json.errors);
        }
    } else {
        displayErrs(['The provided passwords did not match.']);
    }
}
