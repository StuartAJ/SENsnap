self.addEventListener('push', function (event) {
  if (!event.data) return

  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title || 'SEN Snap', {
      body: data.body || 'Your daily questions are ready!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: {
        url: data.url || '/daily',
      },
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const url = event.notification.data?.url || '/daily'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
