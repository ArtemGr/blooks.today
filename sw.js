self.addEventListener ('install', function (event) {
  console.log ('sw, install')})

self.addEventListener ('activate', function (event) {
  console.log ('sw, activate')
  // Reset the cache, just in case.
  // In the future we might want to implement a gentler eviction strategy.
  return caches.delete ('offline')})

self.addEventListener ('message', function (event) {
  // Passing main_js_url is just an example, not currently used in any way.
  if (event.data.main_js_url) console.log ('sw, main_js_url: ', event.data.main_js_url)})

self.addEventListener ('fetch', function (event) {
  event.respondWith (
    fetch (event.request) .then (function (response) {  // Try the network first.
      return caches.open ('offline') .then (function (cache) {
        cache.put (event.request, response.clone())  // And cache the network response.
        return response})
    }) .catch (function (err) {  // If network fails, fall back to the cache.
      return caches.open ('offline') .then (function (cache) {
        return cache.match (event.request)})}))})
