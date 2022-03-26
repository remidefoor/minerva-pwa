'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
    document.querySelector('form').addEventListener('submit', createUser);
}

function stylePwdFields() {
    document.querySelector('#password').classList.add('error');
    document.querySelector('#confirmed-password').classList.add('error');
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

    stylePwdFields();
    resetPwdFields();
}

function pwdsAreEqual() {
    const $pwd = document.querySelector('#password').value;
    const $confirmedPwd = document.querySelector('#confirmed-password').value;
    return $pwd === $confirmedPwd;
}

function createUser(evt) {
    evt.preventDefault();
    if (pwdsAreEqual()) {

    }
}
