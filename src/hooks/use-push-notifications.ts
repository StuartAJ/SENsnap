'use client'

import { useState, useCallback } from 'react'

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { error: 'Push notifications are not supported in this browser' }
    }

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey('p256dh')!)
                )
              ),
              auth: btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey('auth')!)
                )
              ),
            },
          },
        }),
      })

      if (response.ok) {
        setIsSubscribed(true)
        return { success: true }
      }

      return { error: 'Failed to register subscription' }
    } catch {
      return { error: 'Failed to subscribe to notifications' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isSubscribed, isLoading, subscribe }
}
