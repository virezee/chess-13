import { UnifrakturMaguntia, Archivo, Tinos, Cinzel, EB_Garamond } from 'next/font/google'
import localFont from 'next/font/local'

const cloisterBlack = localFont({
  src: './fonts/CloisterBlack.woff2',
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
const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  weight: ['400', '500', '600']
})
export const typography = [
  cloisterBlack.variable,
  unifrakturMaguntia.variable,
  archivo.variable,
  tinos.variable,
  cinzel.variable,
  ebGaramond.variable
].join(' ')