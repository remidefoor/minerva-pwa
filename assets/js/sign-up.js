'use strict';

document.addEventListener('DOMContentLoaded', init);

function init(evt) {
    document.querySelector('#sign-up').addEventListener('submit', ensurePwdEquality);
}

function ensurePwdEquality(evt) {
    evt.preventDefault();
    const $pwd = document.querySelector('#password').value;
    const $confirmedPwd = document.querySelector('#confirmed-password').value;

    if ($pwd === $confirmedPwd) {

    }
}
