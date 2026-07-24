import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/practice', '/games', '/exams', '/blog', '/about'],
      disallow: ['/api/', '/_next/', '/dashboard', '/admin'],
    },
    sitemap: 'https://type100x.com/sitemap.xml',
  };
}
