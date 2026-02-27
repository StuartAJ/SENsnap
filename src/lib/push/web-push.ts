import webpush from 'web-push'

export function configureWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
}

export async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string }
) {
  configureWebPush()

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    )
    return { success: true }
  } catch (err) {
    const error = err as { statusCode?: number }
    if (error.statusCode === 410 || error.statusCode === 404) {
      return { success: false, expired: true }
    }
    return { success: false, expired: false }
  }
}
