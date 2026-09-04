import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://chess-13-epoch.vercel.app', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://chess-13-epoch.vercel.app/rules', changeFrequency: 'monthly', priority: 0.8 }
  ]
}