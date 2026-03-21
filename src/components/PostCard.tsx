import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <div className={`glass rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 ${featured ? 'md:col-span-3 flex flex-col md:flex-row' : 'flex flex-col'}`}>
      <div className={`relative ${featured ? 'md:w-2/3 h-64 md:h-96' : 'w-full h-48'}`}>
        {post.thumbnail ? (
           <Image
             src={post.thumbnail}
             alt={post.title}
             fill
             className="object-cover"
             sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
           />
        ) : (
           <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
             No Image
           </div>
        )}
      </div>
      <div className={`p-6 flex flex-col justify-center ${featured ? 'md:w-1/3' : 'w-full'}`}>
        <div className="flex items-center text-sm text-[#00f0ff] mb-2 font-semibold">
          <span className="uppercase tracking-wider mr-4">{post.category}</span>
          <span>{post.readTime}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className={`${featured ? 'text-3xl lg:text-4xl' : 'text-xl'} font-bold hover:text-[#00f0ff] transition-colors mb-2 line-clamp-2`}>
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-400 line-clamp-3 mb-4">
          {post.content.replace(/[#*`_]/g, '').slice(0, 150)}...
        </p>
        <div className="mt-auto">
          <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-white hover:text-[#00f0ff] underline underline-offset-4 decoration-[#00f0ff]">
            Read more &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
