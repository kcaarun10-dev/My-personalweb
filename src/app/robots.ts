import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Disallow crawling admin dashboards or apis
    },
    sitemap: 'https://arunregmi.com.np/sitemap.xml',
  };
}
