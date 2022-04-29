/**
 * Optimal solution:
 * GET request of subscription
 * if (404) POST subscription
 * else PUT subscription
 * NOT implemented because not application functionality, but assignment requirement
 */

'use strict';

const VAPID_PUBLIC_KEY = 'BG9GvypG3RyfZx4-PDKM5FduWhOuxtrCOZ9fgcRq-g8prPDchbw_FeiEPw0j64K7k9GjRI1WKb3x1zhWvgqcn9c';

async function requestSubscribeForNotifications() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission === 'granted') subscribeForNotifcations();
    }
}

async function subscribeForNotifcations() {
    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: convertBase64StringToUint8Array(VAPID_PUBLIC_KEY)
    };

    const serviceWorkerRegistration = await navigator.serviceWorker.ready; // service worker support checked in grand parent function, registerServiceWorker
    const subscription = await serviceWorkerRegistration.pushManager.subscribe(subscribeOptions);
    postNotificationSubscription(subscription);
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

async function postNotificationSubscription(subscription) {
    const userId = await getUidFromLocalForage();
    fetch(`${config.minervaBaseUrl}/users/${userId}/notifications/subscription`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(subscription)
    });
}
