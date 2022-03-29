'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
    document.querySelector('form').addEventListener('submit', createUser);
}

function resetPwdFields() {
    document.querySelector('#password').value = '';
    document.querySelector('#confirmed-password').value = '';
}

function pwdsAreEqual() {
    const $pwd = document.querySelector('#password').value;
    const $confirmedPwd = document.querySelector('#confirmed-password').value;
    return $pwd === $confirmedPwd;
}

function postUser() {
    return fetch(`${config.minervaBaseUrl}/users`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(getUserPostBody())
    });
}

async function createUser(evt) {
    evt.preventDefault();
    if (pwdsAreEqual()) {
        const res = await postUser();
        const json = await res.json();
        if (res.status === 201) {
            await processUid(json.id);
        } else if (res.status === 400) {
            displayAuthErrs(json.errors);
        } else if (res.status === 409) {
            displayAuthErrs([json.message]);
        }
    } else {
        displayAuthErrs(['The provided passwords did not match.']);
    }
    resetPwdFields();
}
