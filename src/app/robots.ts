import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://braine-x.com'; // Actual production domain

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/universities', '/scholarships', '/api/public'],
      disallow: ['/dashboard', '/admin', '/api/auth', '/api/private'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
