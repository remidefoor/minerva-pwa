# Backend

This Progressive Web App makes use of two backends.

## Minerva

The first one is the Minerva API. This API has a [Laravel](https://git.ti.howest.be/TI/2021-2022/s4/web-and-mobile-technology/projects/remi-defoor/04-laravel) and [Node.js](https://git.ti.howest.be/TI/2021-2022/s4/web-and-mobile-technology/projects/remi-defoor/03-nodejs) implementation, based on the same [OpenAPI Specification](https://git.ti.howest.be/TI/2021-2022/s4/web-and-mobile-technology/projects/remi-defoor/99-documentation/-/blob/main/api_spec.yaml).

Both backends have to be ran locally. The Laravel implementation contains the migrations and seeders. Push notifications, on the other hand, are only implemented in Node.js.

You might have to adapt the base URL of the backend depending on your setup. This can be done in script.js.

## Google Books

The second one is the Google Books API, used to get all the metadata of a book, based on its ISBN.