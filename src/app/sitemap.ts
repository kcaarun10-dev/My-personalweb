import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const URL = 'https://arunregmi.com.np';
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    { url: `${URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Dynamic blog posts
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      routes.push({
        url: `${URL}/blog/${data.slug}`,
        lastModified: new Date(data.createdAt),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.warn("Could not generate dynamic sitemap, check firebase config");
  }

  return routes;
}
