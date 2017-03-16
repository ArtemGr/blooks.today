self.addEventListener ('install', function (event) {
  console.log ('sw, install')})

self.addEventListener ('activate', function (event) {
  console.log ('sw, activate')
  // Reset the cache, just in case.
  // In the future we might want to implement a gentler eviction strategy.
  return caches.delete ('offline')})

// self.addEventListener ('message', function (event) {
//   if (event.data.foo) foo (event.data)})

self.addEventListener ('fetch', function (event) {
  var url = event.request.url.toString()
  var skip_cache = false
  if (url.includes ('//www.googleapis.com/')) skip_cache = true  // We don't want to mess with the auth.
  else if (url.includes ('//securetoken.googleapis.com/')) skip_cache = true
  else if (url.includes ('//sentry.io/api/')) skip_cache = true
  else if (url.includes ('//blooks.today/r/')) skip_cache = true
  else if (url.includes ('//sphere.buzz/r/')) skip_cache = true

  if (skip_cache) event.respondWith (fetch (event.request))  // CORS often fails on FF.  :(
  else event.respondWith (
    fetch (event.request) .then (function (response) {  // Try the network first.
      return caches.open ('offline') .then (function (cache) {
        cache.put (event.request, response.clone())  // And cache the network response.
        return response})
    }) .catch (function (err) {  // If network fails, fall back to the cache.
      return caches.open ('offline') .then (function (cache) {
        return cache.match (event.request)})}))})
