import type { Metadata } from 'next'
import { Archivo, Cinzel, Tinos, UnifrakturMaguntia } from 'next/font/google'
import localFont from 'next/font/local'
import '../styles/globals.css'

const cloisterBlack = localFont({
  src: '../styles/fonts/CloisterBlack.woff2',
  variable: '--font-cloister-black'
})
const unifrakturMaguntia = UnifrakturMaguntia({
  variable: '--font-unifraktur-maguntia',
  subsets: ['latin'],
  weight: '400'
})
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600']
})
const tinos = Tinos({
  variable: '--font-tinos',
  subsets: ['latin'],
  weight: ['400', '700']
})
const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: '500'
})
export const metadata: Metadata = {
  title: 'Chess 13 (Chess 2: Epoch)',
  description: 'A 13 x 13 chess variant played hotseat on one screen.'
}
const themeScript = `(function(){try{var s=localStorage.getItem("theme");document.documentElement.dataset.theme=s||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}})();`

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${cloisterBlack.variable} ${unifrakturMaguntia.variable} ${tinos.variable} ${archivo.variable} ${cinzel.variable}  h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}