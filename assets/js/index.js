'use strict';

const VAPID_PUBLIC_KEY = 'BG9GvypG3RyfZx4-PDKM5FduWhOuxtrCOZ9fgcRq-g8prPDchbw_FeiEPw0j64K7k9GjRI1WKb3x1zhWvgqcn9c';

document.addEventListener('DOMContentLoaded', init);

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
        await navigator.serviceWorker.ready;
        subscribeRegisterForNotifications();
    }
}

function subscribeRegisterForNotifications() {
    if ('Notification' in window) {
        const permission = Notification.requestPermission();
        if (permission === 'granted') subscribeForNotifcations();
    }
}

function subscribeForNotifcations() {
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: convertBase64StringToUint8Array(VAPID_PUBLIC_KEY)
    };

    const serviceWorkerRegistration = await navigator.serviceWorker.ready; // service worker support checked in grand parent function, registerServiceWorker
    const subscription = serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);
    // TODO send subscription to server
    console.log(JSON.stringify(subscription));
}

function convertBase64StringToUint8Array(base64String) { // TODO read
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
