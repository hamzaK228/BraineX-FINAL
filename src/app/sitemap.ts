import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // In a real production scenario with dynamic routes (e.g., /universities/[id]), 
  // you would fetch those IDs from the database and map them here.
  // For now, we return the primary static and top-level dynamic routes.
  
  const baseUrl = 'https://braine-x.com'; // Actual production domain

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/universities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
