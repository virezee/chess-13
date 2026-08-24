import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { THEME } from '@/constants/storage'
import { AppHeader } from '@/components/AppHeader'
import { typography } from '@/styles/typography'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Chess 13 (Chess II: Epoch)',
  description: 'A 13 × 13 chess variant.'
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${typography} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <ThemeProvider storageKey={THEME} attribute='data-theme' defaultTheme='system' enableSystem>
          <AppHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}