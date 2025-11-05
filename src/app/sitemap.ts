import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const routes = ['', '/discover', '/community', '/threads', '/directory']
  const now = new Date()
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: r === '' ? 1 : 0.7,
  }))
}


