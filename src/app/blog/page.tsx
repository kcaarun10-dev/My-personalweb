import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, QueryDocumentSnapshot, QueryConstraint } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import AdUnit from '@/components/AdUnit';
import { Post } from '@/types';
import BlogFilters from '@/components/BlogFilters';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ArunTech — Latest Tech News & Smartphone Leaks',
  description: 'Your premium source for Xiaomi, Apple, and AI news. Deep-dives, reviews, and exclusive tech leaks by Arun Regmi.',
  keywords: ['Tech News', 'Xiaomi Leaks', 'iPhone Rumors', 'AI News', 'Smartphone Reviews'],
  alternates: {
    canonical: 'https://arunregmi.com.np/blog',
  },
};

interface BlogSearchParams {
  q?: string;
  category?: string;
}

async function getPosts(searchParams: BlogSearchParams) {
  const postsRef = collection(db, 'posts');
  let q;

  // Basic query properties
  const queryConstraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(100)];

  // Apply category filter if present
  if (searchParams.category && searchParams.category !== 'All') {
    queryConstraints.push(where('category', '==', searchParams.category));
  }

  q = query(postsRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  let posts = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() })) as Post[];

  // Apply search filter if present (client-side/manual filtering as Firestore doesn't support full-text search easily)
  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.content.toLowerCase().includes(searchTerm)
    );
  }

  return posts;
}

async function getAuthors() {
  if (!db) return {};
  const snapshot = await getDocs(collection(db, 'authors'));
  const authors: Record<string, any> = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    authors[doc.id] = data;
    if (data.slug) {
      authors[data.slug] = data;
    }
  });
  return authors;
}

export default async function BlogHome({ searchParams }: { searchParams: Promise<BlogSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const posts = await getPosts(resolvedSearchParams);
  const authors = await getAuthors();
  
  // Decide which post is featured based on date if no filters are applied
  const isFiltering = !!(resolvedSearchParams.q || (resolvedSearchParams.category && resolvedSearchParams.category !== 'All'));
  const featuredPost = !isFiltering ? posts[0] : null;
  const latestPosts = !isFiltering ? posts.slice(1) : posts;

  return (
    <div className="py-12 px-4 sm:px-6">
      {/* Blog Leaderboard */}
      <AdUnit slot="BLOG_HEADER_SLOT" className="mb-16" />

      {/* newsroom banner */}
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
          THE <span className="text-[#00f0ff] underline decoration-[8px] underline-offset-[12px] decoration-[#00f0ff]/20">NEWSROOM</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-medium tracking-wide uppercase">
          Exclusive Tech leaks • Smartphone Reviews • Deep AI Analysis
        </p>
      </div>

      {/* filters & search */}
      <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-2xl mb-12" />}>
        <BlogFilters />
      </Suspense>

      {/* featured post section */}
      {featuredPost && (
        <section className="mb-24 relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-[2px] bg-[#00f0ff]" />
            <h2 className="text-[10px] font-black text-[#00f0ff] uppercase tracking-[0.3em]">Featured Story</h2>
          </div>
          <PostCard post={featuredPost} featured author={authors[featuredPost.authorId || 'arun-regmi']} />
        </section>
      )}

      {/* In-Feed Ad */}
      {!featuredPost && <AdUnit slot="BLOG_FEED_SLOT" format="rectangle" className="my-12" />}

      {/* grid section */}
      <section>
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic underline decoration-2 decoration-[#00f0ff]/50 underline-offset-8">
            {isFiltering ? 'Search Results' : 'Latest Insights'}
          </h2>
          <span className="text-xs font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {posts.length} articles
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestPosts.map(post => (
              <PostCard key={post.id} post={post} author={authors[post.authorId || 'arun-regmi']} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center glass rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </section>

      {/* Blog Footer Ad */}
      <AdUnit slot="BLOG_FOOTER_SLOT" className="mt-24 border-t border-white/10 pt-16" />
    </div>
  );
}
