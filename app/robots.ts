import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'Amzn-SearchBot', allow: '/' },
      { userAgent: 'Amzn-User', allow: '/' },
    ],
  }
}
