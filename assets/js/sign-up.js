'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
    document.querySelector('form').addEventListener('submit', createUser);
}

function resetPwdFields() {
    const errColor = '#ff0000'

    const $pwd = document.querySelector('#password');
    $pwd.value = '';
    $pwd.style.borderColor = errColor;

    const $confirmedPwd = document.querySelector('#confirmed-password');
    $confirmedPwd.value = '';
    $confirmedPwd.style.borderColor = errColor;
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

function createUser(evt) {
    evt.preventDefault();
    if (pwdsAreEqual()) {

    }
}
