import type { MetadataRoute } from 'next';
import { SITE_URL } from '@libs/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/login', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
