import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

async function getCategoryPosts(category: string): Promise<Post[]> {
  if (!db) return [];
  
  // Mapping URL slug categories back to display names used in DB if necessary
  const categoryMap: Record<string, string> = {
    'mobile': 'Mobile',
    'ai': 'AI',
    'web-dev': 'Web Dev',
    'gadgets': 'Gadgets'
  };

  const dbCategory = categoryMap[category.toLowerCase()] || category;
  
  try {
    const postsRef = collection(db, 'posts');
    // Simplified query to avoid mandatory composite indexes
    const q = query(
      postsRef, 
      where('category', '==', dbCategory)
    );
    const snapshot = await getDocs(q);
    const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    
    // Sort client-side by createdAt desc
    return fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = await getCategoryPosts(category);
  
  if (posts.length === 0 && !['mobile', 'ai', 'web-dev', 'gadgets'].includes(category.toLowerCase())) {
     return notFound();
  }

  const categoryTitle = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="space-y-8 py-8">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Category: <span className="text-[#00f0ff]">{categoryTitle}</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg">
          Explore our latest articles and insights on {categoryTitle}.
        </p>
      </header>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-2xl text-center border border-white/5">
           <h3 className="text-2xl font-bold mb-2">No articles found</h3>
           <p className="text-gray-400">We're currently working on some fresh content for this category. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
