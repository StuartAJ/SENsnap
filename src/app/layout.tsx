import type { Metadata, Viewport } from 'next'
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'SEN Snap',
  description: 'Daily polling and insights for SENCOs and SEN staff',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7AC796',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plusJakartaSans.variable}`}>
        {children}
      </body>
    </html>
  )
}
