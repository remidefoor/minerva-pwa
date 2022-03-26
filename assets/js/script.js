'use strict';

const config = {
    baseUrl: 'http://laravel.minerva.com/api'
}

const store = localforage.createInstance({
    name: 'minerva',
    version: 1
});

async function getUidFromLocalForage() {
    return await store.getItem('uid');
}

async function setUidInLocalStorage(uid) {
    await store.setItem('uid', uid);
}
