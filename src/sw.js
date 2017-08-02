/* eslint no-console: 0 */
/* eslint prefer-arrow-callback: 0 */
importScripts('./cachepolyfill.js'); // eslint-disable-line

var CACHE_VERSION = 5;
var CACHE = `movies-pwa-cache-v${ CACHE_VERSION }`;

// CHECK CAREFULLY HERE WHEN YOU ADD SOMETHING
// IF YOUR ADDITION IS ERRONEOUS e.g. wrong url
// IT WILL BREAK ALL THE CACHING
const assetsToCache = [
  // LOCAL FILES
  '/manifest.json',
  '/favicon.ico',
  '/',                     // If you have separate JS/CSS files,
  '/index.html'            // add path to those files here
];

// On install, cache some resource.
self.addEventListener('install', function (evt) {
  self.skipWaiting();
  // console.info('SW: The service worker is being installed. Version:', CACHE_VERSION);

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(self.skipWaiting().then(precache()));
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (evt) {
  if(evt.request.url.indexOf('undefined') > -1){
    // evt.respondWith(fromCache(evt.request))
  } else {
    // Try cache, if the resource is not there check network
    evt.respondWith(fromCache(evt.request)
      .catch(function () {
        return fromNetwork(evt.request);
      })
      .catch(function(e){
        console.log(e)
      })
    );
  }
});

self.addEventListener('activate', event => {
  self.clients.claim();
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map((key) => {
        if (key !== CACHE) {
          return caches.delete(key);
        }
        return caches;
      })
    )).then(() => {
        // Feature-detect (works only on latest Chrome)
      if (self.registration.navigationPreload) {
          // Enable navigation preloads!
        return self.registration.navigationPreload.enable();
      }
    })
    .then(() => {
      console.log(`SW: V${ CACHE_VERSION } handles fetches`);
    })
  );
});

/**
 * Open a cache and use `addAll()` with an array of assets to add all of them
 * to the cache. Return a promise resolving when all the assets are added.
 *
 * @returns {promise}
 */
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(assetsToCache)
      .then(function () {
        console.info('SW: Assets cached');
      })
      .catch(function () {
        console.info('SW: Error on caching assets. Serving from network.');
      });
  });
}

/**
 * Update consists in opening the cache, performing a network request and
 * storing the new response data.
 *
 * @param {object} request
 * @returns {promise}
 */
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      cache.put(request, response.clone())
        .catch(function () {
          // console.info('SW: Error in putting something on the cache');
        });
      return response;
    });
  });
}

/**
 * Time limited network request. If the network fails or the response is not
 * served before timeout, the promise is rejected.
 *
 * @param {object} request
 * @returns {promise}
 */
function fromNetwork(request) {
  return new Promise(function (fulfill, reject) {
      // Cache assets
    if (request.url.indexOf('.png') > -1
         || request.url.indexOf('.css') > -1
         || request.url.indexOf('.jpg') > -1
         || request.url.indexOf('.jpeg') > -1
         || request.url.indexOf('.html') > -1
         || request.url.indexOf('.js') > -1
         || request.url.indexOf('.svg') > -1
         || request.url.indexOf('normalize') > -1
         || request.url.indexOf('cutegrids') > -1
         || request.url.indexOf('woff') > -1
         || request.url.indexOf('woff2') > -1) {
      update(request).then(fulfill).catch(reject);
    } else {
      fetch(request).then(fulfill).catch(reject);
    }
  });
}

/**
 * Open the cache where the assets were stored and search for the requested
 * resource. Notice that in case of no matching, the promise still resolves
 * but it does with `undefined` as value.
 *
 * @param {object} request
 * @returns {promise}
 */
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}
