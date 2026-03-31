import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, QueryDocumentSnapshot } from 'firebase/firestore';
import PostCard from '@/components/PostCard';
import { Post } from '@/types';

export default async function RelatedPosts({ category, currentSlug }: { category: string, currentSlug: string }) {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('category', '==', category), 
    limit(4)
  );
  
  const snapshot = await getDocs(q);
  const posts = snapshot.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() } as Post))
    .filter((p: Post) => p.slug !== currentSlug)
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="mt-24 pt-16 border-t border-white/5">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-12 h-[2px] bg-[#00f0ff]" />
        <h2 className="text-[10px] font-black text-[#00f0ff] uppercase tracking-[0.3em]">YOU MIGHT ALSO LIKE</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
