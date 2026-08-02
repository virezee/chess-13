import { Archivo, Cinzel, Tinos, UnifrakturMaguntia } from 'next/font/google'
import localFont from 'next/font/local'

/** Wordmark only. Not in the Google Fonts catalogue, so it ships with the project. */
const cloisterBlack = localFont({
  src: './fonts/CloisterBlack.woff2',
  variable: '--font-cloister-black'
})
/** Numbers, and the piece names in the promotion slots. */
const unifrakturMaguntia = UnifrakturMaguntia({
  variable: '--font-unifraktur-maguntia',
  subsets: ['latin'],
  weight: '400'
})
/** Interface text. */
const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600']
})
/** Move notation and file ranges. */
const tinos = Tinos({
  variable: '--font-tinos',
  subsets: ['latin'],
  weight: ['400', '700']
})
/** The M on the command square. */
const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: '500'
})
/** Every font variable, for the class list on `<html>`. */
export const fontVariables = [
  cloisterBlack.variable,
  unifrakturMaguntia.variable,
  archivo.variable,
  tinos.variable,
  cinzel.variable
].join(' ')