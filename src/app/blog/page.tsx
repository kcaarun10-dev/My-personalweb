import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import AdUnit from '@/components/AdUnit';
import { Post } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * BLOG METADATA (Home Page /blog)
 * Optimized for 'ArunTech Blog', 'Tech News', and 'Smartphone Leaks'.
 */
export const metadata: Metadata = {
  title: 'ArunTech — Latest Tech News & Smartphone Leaks',
  description: 'Your premium source for Xiaomi, Apple, and AI news. Deep-dives, reviews, and exclusive tech leaks by Arun Regmi.',
  keywords: ['Tech News', 'Xiaomi Leaks', 'iPhone Rumors', 'AI News', 'Smartphone Reviews'],
  alternates: {
    canonical: 'https://arunregmi.com.np/blog',
  },
};

async function getPosts() {
  const postsRef = collection(db, 'posts');
  // Simple query: get 10 most recent posts
  const q = query(postsRef, orderBy('createdAt', 'desc'), limit(10));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
}

export default async function BlogHome() {
  const posts = await getPosts();
  const featuredPost = posts[0];
  const latestPosts = posts.slice(1);

  return (
    <div className="py-8">
      {/* Blog Leaderboard */}
      <AdUnit slot="BLOG_HEADER_SLOT" className="mb-8" />

      {featuredPost && (
        <section className="mb-16">
          <h2 className="text-sm font-bold text-[#00f0ff] uppercase tracking-widest mb-4">Featured Story</h2>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* In-Feed Ad */}
      <AdUnit slot="BLOG_FEED_SLOT" format="rectangle" className="my-12" />

      <section>
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Blog Footer Ad */}
      <AdUnit slot="BLOG_FOOTER_SLOT" className="mt-16" />
    </div>
  );
}
