self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('budget-cache-v1').then(cache => {
        console.log('Opened cache')
        return cache.addAll([
          '/',
          '/index.html',
          '/index.js',
          '/manifest.json',
          '/assets/js/app.js',
          '/assets/styles.css',
          '/assets/icons/icon-192x192.png',
          '/assets/icons/icon-512x512.png'
        ])
      })
    )
  })
  
  self.addEventListener('fetch', event => {
  
    if (event.request.url.includes('/api/')) {
      event.respondWith(
        caches.open('data-cache-v1').then(cache => {
          return fetch(event.request)
            .then(res => {
              if (res.status === 200) {
                cache.put(event.request.url, res.clone())
              }
            })
            .catch(err => {
              return cache.match(event.request)
            })
        })
        .catch(err => console.error(err))
      )
      return
    }
  
    event.respondWith(
      fetch(event.request).catch(err => {
        return caches.match(event.request).then(res => {
          if (res) {
            return res
          } else if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/')
          }
        })
      })
    )
  
  })