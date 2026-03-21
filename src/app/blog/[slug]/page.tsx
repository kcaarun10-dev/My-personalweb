import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Post } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // Dark theme syntax highlight
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import AdUnit from '@/components/AdUnit';

// Required for specific Next.js page metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} - ArunTech`,
    description: post.content.slice(0, 150),
    alternates: {
      canonical: `https://arunregmi.com.np/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 150),
      url: `https://arunregmi.com.np/blog/${post.slug}`,
      type: 'article',
      images: [{ url: post.thumbnail }],
    },
  };
}

async function getPostData(slug: string): Promise<Post | null> {
  if (!db) return null;
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);
  
  if (!post) {
    return notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{post.title}</h1>
        <div className="flex justify-center items-center space-x-4 text-gray-400 text-sm">
          <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            {post.category}
          </span>
          <span>&middot;</span>
          <span>{post.readTime}</span>
          <span>&middot;</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </header>

      {post.thumbnail && (
        <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden glass shadow-2xl">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {/* AdSlot 2: In-Article Top (Responsive) */}
      <AdUnit slot="ARTICLE_TOP_AD_SLOT" />

      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.thumbnail ? [post.thumbnail] : [],
            datePublished: new Date(post.createdAt).toISOString(),
            author: [{ '@type': 'Person', name: 'Arun Regmi', url: 'https://arunregmi.com.np/about' }],
          }),
        }}
      />

      <div className="prose prose-invert prose-lg max-w-none prose-a:text-[#00f0ff] prose-img:rounded-xl">
        <ReactMarkdown 
           remarkPlugins={[remarkGfm]}
           rehypePlugins={[rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* AdSlot 3: In-Article Bottom (Responsive) */}
      <AdUnit slot="ARTICLE_BOTTOM_AD_SLOT" />

      <hr className="my-12 border-gray-800" />
      <div className="flex flex-col space-y-8">
         <div className="flex justify-start">
            <LikeButton postId={post.id as string} />
         </div>
         <Comments postId={post.id as string} />
      </div>
    </article>
  );
}
