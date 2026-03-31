import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { formatTimeAgo, formatDate } from '@/lib/timeAgo';

export default function PostCard({ post, featured = false, author }: { post: Post; featured?: boolean; author?: any }) {
  const authorName = author?.name || post.authorName || 'Arun Regmi';
  const authorPhoto = author?.profilePic;

  return (
    <article className={`group relative glass rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[#00f0ff]/30 border border-white/5 ${featured ? 'md:col-span-3 grid md:grid-cols-2 lg:grid-cols-5' : 'flex flex-col'}`}>
      {/* Thumbnail */}
      <div className={`relative ${featured ? 'md:col-span-1 lg:col-span-3 h-64 md:h-full overflow-hidden' : 'w-full h-52 overflow-hidden'}`}>
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={featured ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 33vw'}
            priority={featured}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {/* Category Overlay */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#00f0ff]/20 backdrop-blur-md text-[#00f0ff] text-[10px] uppercase font-black px-3 py-1 rounded-md tracking-wider border border-[#00f0ff]/30">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-6 md:p-8 flex flex-col ${featured ? 'md:col-span-1 lg:col-span-2' : 'flex-1'}`}>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 h-5">
          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]" />
            {post.readTime}
          </span>
          <span className="text-gray-600">|</span>
          <span className="truncate">{formatTimeAgo(post.createdAt)}</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/link">
          <h2 className={`${featured ? 'text-2xl lg:text-3xl' : 'text-xl'} font-bold text-white hover:text-[#00f0ff] transition-colors leading-tight mb-3 line-clamp-2`}>
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 mb-6 flex-grow">
          {post.content.replace(/[#*`_]/g, '').slice(0, 160)}...
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a0a0a] to-[#222] border border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-lg overflow-hidden relative">
              {authorPhoto ? (
                <Image 
                  src={authorPhoto} 
                  alt={authorName} 
                  fill 
                  className="object-cover" 
                  style={{ objectPosition: author?.profilePos ? `${author.profilePos.x}% ${author.profilePos.y}%` : 'center' }} 
                />
              ) : (
                authorName?.split(' ').map((n: string) => n[0]).join('').slice(0,2) || 'AR'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none hover:text-[#00f0ff] transition-colors">{authorName}</span>
              <span className="text-[10px] text-gray-500 mt-0.5">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`} 
            className="p-2 rounded-full bg-white/5 hover:bg-[#00f0ff]/10 text-white hover:text-[#00f0ff] transition-all border border-white/10 hover:border-[#00f0ff]/30"
            aria-label={`Read more about ${post.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right">
              <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
