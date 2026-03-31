"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Author, Post } from '@/types';
import { useParams } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { FaFacebook, FaInstagram, FaGithub, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

export default function AuthorProfile() {
  const { id } = useParams() as { id: string };
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorData();
  }, [id]);

  const fetchAuthorData = async () => {
    if (!db || !id) return;
    try {
      let authorData: Author | null = null;
      let authorId = id;

      // 1. Try fetching by Document ID (UID)
      const authorSnap = await getDoc(doc(db, 'authors', id));
      if (authorSnap.exists()) {
        authorData = authorSnap.data() as Author;
      } else {
        // 2. Try fetching by Slug
        const qSlug = query(collection(db, 'authors'), where('slug', '==', id), limit(1));
        const slugSnap = await getDocs(qSlug);
        if (!slugSnap.empty) {
          authorData = slugSnap.docs[0].data() as Author;
          authorId = authorData.uid;
        }
      }

      if (authorData) {
        setAuthor(authorData);
        
        // Fetch Author's Posts using any identifying field
        const authorIdentifiers = [authorData.uid];
        if (authorData.slug) authorIdentifiers.push(authorData.slug);
        // Ensure the ID from URL is also checked
        if (!authorIdentifiers.includes(id)) authorIdentifiers.push(id);

        const qPosts = query(
          collection(db, 'posts'), 
          where('authorId', 'in', authorIdentifiers),
          orderBy('createdAt', 'desc')
        );
        const postsSnap = await getDocs(qPosts);
        setPosts(postsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Post)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#00f0ff] font-bold">Loading Author Profile...</div>;
  if (!author) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Author not found.</div>;

  return (
    <div className="bg-[#050505] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="w-full h-80 relative overflow-hidden">
        {author.coverPic ? (
           <img 
              src={author.coverPic} 
              className="w-full h-full object-cover" 
              style={{ objectPosition: author.coverPos ? `${author.coverPos.x}% ${author.coverPos.y}%` : 'center' }}
              alt="Cover" 
           />
        ) : (
           <div className="w-full h-full bg-gradient-to-r from-[#00f0ff]/10 to-purple-600/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
         <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            <div className="w-44 h-44 rounded-[40px] border-8 border-[#050505] bg-gray-900 overflow-hidden shadow-2xl">
               <img 
                  src={author.profilePic || `https://ui-avatars.com/api/?name=${author.name}`} 
                  className="w-full h-full object-cover" 
                  style={{ objectPosition: author.profilePos ? `${author.profilePos.x}% ${author.profilePos.y}%` : 'center' }}
                  alt={author.name} 
               />
            </div>
            <div className="flex-1 pb-4">
               <h1 className="text-5xl font-black text-white tracking-tighter">{author.name}</h1>
               <p className="text-[#00f0ff] font-bold tracking-[0.2em] uppercase mt-2">{author.designation}</p>
            </div>
            <div className="flex gap-4 pb-6">
               {author.socials?.facebook && <a href={author.socials.facebook} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#00f0ff] border border-white/10 transition-all hover:scale-110"><FaFacebook size={20}/></a>}
               {author.socials?.instagram && <a href={author.socials.instagram} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#00f0ff] border border-white/10 transition-all hover:scale-110"><FaInstagram size={20}/></a>}
               {author.socials?.github && <a href={author.socials.github} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#00f0ff] border border-white/10 transition-all hover:scale-110"><FaGithub size={20}/></a>}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
               <section className="glass p-8 rounded-[32px] border border-white/10">
                  <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-widest mb-4">About the Author</h2>
                  <p className="text-gray-300 leading-relaxed italic">"{author.bio}"</p>
               </section>
               
               <div className="glass p-8 rounded-[32px] border border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                     <FaMapMarkerAlt className="text-[#00f0ff]" /> <span>{author.location || 'Tech Base'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                     <FaLink className="text-[#00f0ff]" /> <span>arunregmi.com.np</span>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
               <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  Articles by {author.name.split(' ')[0]}
                  <span className="text-xs bg-white/10 text-gray-400 px-3 py-1 rounded-full">{posts.length}</span>
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map(post => (
                    <PostCard key={post.id} post={post} author={author} />
                  ))}
               </div>
               {posts.length === 0 && <p className="text-gray-600 italic">This author hasn't published any articles yet.</p>}
            </div>
         </div>
      </div>
    </div>
  );
}
