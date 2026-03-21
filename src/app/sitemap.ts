import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const URL = 'https://arunregmi.com.np';
  
  // Base routes
  const routes = [
    { url: `${URL}`, lastModified: new Date() },
    { url: `${URL}/blog`, lastModified: new Date() },
    { url: `${URL}/tools`, lastModified: new Date() },
    { url: `${URL}/about`, lastModified: new Date() },
    { url: `${URL}/contact`, lastModified: new Date() },
    { url: `${URL}/privacy-policy`, lastModified: new Date() },
    { url: `${URL}/categories/mobile`, lastModified: new Date() },
    { url: `${URL}/categories/ai`, lastModified: new Date() },
    { url: `${URL}/categories/web-dev`, lastModified: new Date() },
    { url: `${URL}/categories/gadgets`, lastModified: new Date() },
  ];

  // Dynamic blog posts
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      routes.push({
        url: `${URL}/blog/${data.slug}`,
        lastModified: new Date(data.createdAt),
      });
    });
  } catch (error) {
    console.warn("Could not generate dynamic sitemap rules, likely running build without firebase config");
  }

  return routes;
}
