import type { Metadata } from 'next'
import { AppHeader } from '@/components/AppHeader'
import { themeScript } from '@/lib/theme'
import { fontVariables } from '@/styles/typography'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Chess 13 (Chess II: Epoch)',
  description: 'A 13 x 13 chess variant played hotseat on one screen.'
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${fontVariables} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='min-h-full flex flex-col'>
        <AppHeader />
        {children}
      </body>
    </html>
  )
}