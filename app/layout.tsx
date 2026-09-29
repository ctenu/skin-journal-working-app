import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Self-hosted via @fontsource: next/font/google fails on Vercel builds when
// Google Fonts returns font URLs without a file extension
const playfair = localFont({
  src: [
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-playfair',
})

const dmSans = localFont({
  src: [
    { path: '../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2', weight: '500' },
  ],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Skin Journal',
  description: 'Daily skin trigger tracker',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Skin Journal',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2a5240',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
