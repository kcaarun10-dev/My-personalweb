"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function CreatePost() {
  const router = useRouter();
  
  // Front-Matter Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Web Dev');
  const [readTime, setReadTime] = useState('5 min read');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  
  // Content & State
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (!slug || title.length > 0) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
    }
  }, [title]);

  // Auto-calculate reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200); // 200 wpm average
    setReadTime(`${time} min read`);
    
    // Auto-save draft to localStorage
    if (content.length > 0) {
      localStorage.setItem('aruntech_draft', JSON.stringify({ title, slug, category, thumbnailUrl, metaDescription, content }));
    }
  }, [content, title, slug, category, thumbnailUrl, metaDescription]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('aruntech_draft');
    if (draft && !title && !content) {
      const { title, slug, category, thumbnailUrl, metaDescription, content } = JSON.parse(draft);
      setTitle(title); setSlug(slug); setCategory(category); setThumbnailUrl(thumbnailUrl); setMetaDescription(metaDescription); setContent(content);
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        slug,
        category,
        readTime,
        thumbnail: thumbnailUrl,
        metaDescription,
        content,
        published: true,
        createdAt: Date.now(),
      });

      router.push('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      
      {/* Main Content Area - Full Width with Split Screen */}
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a]">
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
           <h1 className="text-2xl font-bold tracking-tight text-white">Create <span className="text-[#00f0ff]">Markdown</span> Post</h1>
           <button onClick={handleSubmit} disabled={loading} className="bg-[#00f0ff] text-black px-8 py-2 font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50">
             {loading ? 'Publishing...' : 'Publish Post'}
           </button>
        </div>

        {/* CSS Grid Split Screen layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          
          {/* LEFT SIDE: Editor & Front Matter */}
          <div className="flex flex-col border-r border-white/10 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              
              {/* Front-Matter Fields */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                 <h2 className="text-[#00f0ff] text-sm font-bold uppercase tracking-widest mb-4">Front-Matter metadata</h2>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs text-gray-400 mb-1 block">Post Title</label>
                     <input type="text" value={title} onChange={e => setTitle(e.target.value)} required 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]" />
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 mb-1 block">URL Slug</label>
                     <input type="text" value={slug} onChange={e => setSlug(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]" />
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 mb-1 block">Category</label>
                     <select value={category} onChange={e => setCategory(e.target.value)} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]">
                       <option>Web Dev</option><option>Mobile</option><option>AI</option><option>Gadgets</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs text-gray-400 mb-1 block">Read Time</label>
                     <input type="text" value={readTime} onChange={e => setReadTime(e.target.value)} required 
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]" />
                   </div>
                 </div>
                 
                 <div>
                   <label className="text-xs text-gray-400 mb-1 block">OG Image URL / Thumbnail</label>
                   <input type="text" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} 
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]" />
                 </div>
                 
                 <div>
                   <label className="text-xs text-gray-400 mb-1 block">Meta Description (SEO)</label>
                   <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} maxLength={160}
                          className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] resize-none" />
                   <p className="text-right text-xs text-gray-500 mt-1">{metaDescription.length}/160 chars</p>
                 </div>
              </div>

              {/* Markdown Textarea */}
              <div className="flex-1 flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                   <h2 className="text-[#00f0ff] text-sm font-bold uppercase tracking-widest">Markdown Content</h2>
                   <div className="flex space-x-2 text-xs text-gray-500 font-mono">
                     <span>**Bold**</span>
                     <span>*Italic*</span>
                     <span># H1</span>
                     <span>![alt](url)</span>
                   </div>
                 </div>
                 <textarea 
                   placeholder="Start writing your masterpiece here..." 
                   value={content} 
                   onChange={e => setContent(e.target.value)} 
                   required 
                   className="w-full flex-1 min-h-[500px] bg-black/30 border border-white/10 rounded-xl p-6 text-gray-300 font-mono text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 resize-y transition-colors leading-relaxed" 
                 />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Live Markdown Preview */}
          <div className="hidden lg:flex flex-col bg-[#050505] overflow-y-auto">
             <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-md p-4 border-b border-white/10 z-10 flex justify-between items-center">
                <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span>Live Rendering Preview</span>
                </h2>
             </div>
             
             {/* Render EXACTLY like it looks on the blog */}
             <div className="p-8">
               <article className="max-w-3xl mx-auto">
                 {/* Preview Headers */}
                 <header className="mb-10 text-center">
                   <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white opacity-90">{title || 'Your Catchy Title...'}</h1>
                   <div className="flex justify-center items-center space-x-4 text-gray-400 text-sm">
                     <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                       {category}
                     </span>
                     <span>&middot;</span>
                     <span>{readTime}</span>
                   </div>
                 </header>

                 {/* Preview Thumbnail */}
                 {thumbnailUrl && (
                   <div className="relative w-full h-[400px] mb-12 rounded-2xl overflow-hidden glass shadow-2xl">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
                   </div>
                 )}

                 {/* Actual React-Markdown Render */}
                 <div className="prose prose-invert prose-lg max-w-none prose-a:text-[#00f0ff] prose-img:rounded-xl prose-headings:text-white">
                   <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                     {content || '*Start typing mapping content on the left to see magic appear here...*'}
                   </ReactMarkdown>
                 </div>
               </article>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
