import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { ContextMenuGuard } from '@/components/ContextMenuGuard'
import { ThemeProvider } from 'next-themes'
import { THEME } from '@/constants/storage'
import { AppHeader } from '@/components/AppHeader'
import { typography } from '@/styles/typography'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://chess-13-epoch.vercel.app'),
  title: { default: 'Chess 13: Epoch', template: '%s | Chess 13: Epoch' },
  description:
    'A free chess variant played on a 13×13 board. Two players on one screen, straight in the browser. No account, no install, and the full rules are included.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Chess 13: Epoch',
    url: '/',
    title: 'Chess 13: Epoch',
    description:
      'A free chess variant on a 13×13 board. Two players, one screen, straight in your browser.'
  },
  verification: { google: '1nchbhWBls6uLd1oBMnQJSJ581vdpM-PouP-cWlk0Kc' },
  twitter: { card: 'summary_large_image' }
}
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${typography} h-full antialiased`}>
      <body className='min-h-full flex flex-col select-none'>
        <ContextMenuGuard />
        <ThemeProvider storageKey={THEME} attribute='data-theme' defaultTheme='system' enableSystem>
          <AppHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}