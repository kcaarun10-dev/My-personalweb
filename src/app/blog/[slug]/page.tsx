import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Post } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import LikeButton from '@/components/LikeButton';
import Comments from '@/components/Comments';
import AdUnit from '@/components/AdUnit';
import { formatTimeAgo, formatDate } from '@/lib/timeAgo';
import Link from 'next/link';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import RelatedPosts from '@/components/RelatedPosts';
import ShareButtons from '@/components/ShareButtons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);
  if (!post) return { title: 'Post Not Found' };

  const excerpt = post.seoDescription || post.content.slice(0, 160).replace(/[#*`_]/g, '');

  return {
    title: `${post.seoTitle || post.title} | ArunTech`,
    description: excerpt,
    keywords: [post.category, 'Tech News', 'Reviews', ...post.title.split(' ')].slice(0, 10),
    alternates: {
      canonical: `https://arunregmi.com.np/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `https://arunregmi.com.np/blog/${post.slug}`,
      siteName: 'ArunTech',
      type: 'article',
      publishedTime: new Date(post.createdAt).toISOString(),
      authors: ['Arun Regmi'],
      category: post.category,
      images: [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      images: [post.thumbnail],
      creator: '@regmi_rays',
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

async function getAuthorData(authorId: string): Promise<any | null> {
  if (!db || !authorId) return null;
  const { doc, getDoc, collection, query, where, getDocs, limit } = await import('firebase/firestore');
  
  // 1. Try UID lookup
  const snap = await getDoc(doc(db, 'authors', authorId));
  if (snap.exists()) return snap.data();

  // 2. Try Slug lookup
  const q = query(collection(db, 'authors'), where('slug', '==', authorId), limit(1));
  const qSnap = await getDocs(q);
  if (!qSnap.empty) return qSnap.docs[0].data();

  return null;
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.slug);

  if (!post) {
    return notFound();
  }

  const author = await getAuthorData(post.authorId || 'arun-regmi');

  return (
    <>
      <ReadingProgressBar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumbs for SEO */}
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#00f0ff] transition-colors">Home</Link>
          <span className="opacity-30">/</span>
          <Link href="/blog" className="hover:text-[#00f0ff] transition-colors">Newsroom</Link>
          <span className="opacity-30">/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{post.category}</span>
        </nav>

        {/* Category & Date */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Link 
            href={`/blog?category=${post.category}`}
            className="bg-[#00f0ff]/10 text-[#00f0ff] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-[#00f0ff]/20 hover:bg-[#00f0ff]/20 transition-all"
          >
            {post.category}
          </Link>
          <span className="text-gray-500 text-xs font-medium">
            {formatDate(post.createdAt)} • {formatTimeAgo(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] text-white tracking-tight">
            {post.title}
          </h1>
          
          {/* Author info */}
          <Link href={`/author/${author?.slug || post.authorId || 'arun-regmi'}`} className="flex items-center justify-center gap-4 group/author">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-xl ring-2 ring-white/5 transition-transform group-hover/author:scale-110">
              {author?.profilePic ? (
                <Image src={author.profilePic} alt={author.name} fill className="object-cover" style={{ objectPosition: author.profilePos ? `${author.profilePos.x}% ${author.profilePos.y}%` : 'center' }} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00f0ff] to-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                   {author?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2) || 'AR'}
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-lg font-black text-white leading-none group-hover/author:text-[#00f0ff] transition-colors">{author?.name || post.authorName || 'Arun Regmi'}</p>
              <div className="flex items-center gap-2 text-gray-500 mt-1 text-xs font-bold">
                 <span>{author?.designation || 'Tech Editor & Developer'}</span>
                 <span className="opacity-30">•</span>
                 <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        </header>

        {/* Featured Image */}
        {post.thumbnail && (
          <div className="relative w-full aspect-video mb-16 rounded-3xl overflow-hidden glass shadow-2xl border border-white/10 group">
            <Image 
              src={post.thumbnail} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              priority 
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        )}

        {/* AdSlot 2: In-Article Top */}
        <AdUnit slot="ARTICLE_TOP_AD_SLOT" className="mb-12" />

        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.seoDescription || post.content.slice(0, 160),
              image: post.thumbnail ? [post.thumbnail] : [],
              datePublished: new Date(post.createdAt).toISOString(),
              dateModified: new Date(post.createdAt).toISOString(),
              author: [{ '@type': 'Person', name: post.authorName || 'Arun Regmi', url: `https://arunregmi.com.np/author/${post.authorId}` }],
              publisher: {
                '@type': 'Organization',
                name: 'ArunTech',
                logo: { '@type': 'ImageObject', url: 'https://arunregmi.com.np/logo.png' }
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://arunregmi.com.np/blog/${post.slug}`
              }
            }),
          }}
        />

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-[#00f0ff] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-strong:font-bold
          prose-code:text-[#00f0ff] prose-code:bg-[#00f0ff]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-2xl
          prose-blockquote:border-l-[#00f0ff] prose-blockquote:bg-[#00f0ff]/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
          prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
          prose-li:text-gray-300
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkUnwrapImages]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({...props}) => <h1 className="text-3xl md:text-4xl mt-12 mb-6" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl md:text-3xl mt-10 mb-5 pb-2 border-b border-white/5" {...props} />,
              h3: ({...props}) => <h3 className="text-xl md:text-2xl mt-8 mb-4 border-l-4 border-[#00f0ff] pl-4" {...props} />,
              p: ({...props}) => <p className="mb-6" {...props} />,
              li: ({...props}) => <li className="mb-2" {...props} />,
              img: ({src, alt}) => (
                <div className="relative w-full min-h-[300px] my-10 group overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src || ''}
                    alt={alt || ''}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {alt && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center block">{alt}</span>
                    </div>
                  )}
                </div>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* AdSlot 3: In-Article Bottom */}
        <AdUnit slot="ARTICLE_BOTTOM_AD_SLOT" className="mt-16" />

        {/* Post Footer / Actions */}
        <footer className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <LikeButton postId={post.id as string} />
              
              {/* Simple Share Buttons */}
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
            
            <Link 
              href="/blog" 
              className="text-sm font-bold text-gray-400 hover:text-[#00f0ff] flex items-center gap-2 transition-colors group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span> Back to newsroom
            </Link>
          </div>

          <RelatedPosts category={post.category} currentSlug={post.slug} />

          <div className="mt-16">
            <Comments postId={post.id as string} />
          </div>
        </footer>
      </article>
    </>
  );
}
