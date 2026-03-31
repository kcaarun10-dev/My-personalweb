"use client";

import { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter, useParams } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { FaBold, FaItalic, FaHeading, FaListUl, FaLink, FaImage, FaCode, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Web Dev');
  const [categories, setCategories] = useState(['Web Dev', 'Mobile', 'AI', 'Gadgets']);
  const [readTime, setReadTime] = useState('5 min read');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [tags, setTags] = useState('');
  const [authorName, setAuthorName] = useState('Arun Regmi');
  const [shortDescription, setShortDescription] = useState('');
  const [published, setPublished] = useState(true);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Content & State
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
      }
    });

    const fetchCategories = async () => {
      if (!db) return;
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        setCategories(snap.docs.map(doc => doc.data().name));
      }
    };

    fetchCategories();
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!db || !id) return;
      try {
        const snapshot = await getDoc(doc(db, 'posts', id));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setCategory(data.category || 'Web Dev');
          setReadTime(data.readTime || '5 min read');
          setContent(data.content || '');
          setThumbnailUrl(data.thumbnail || '');
          setTags((data.tags || []).join(', '));
          setAuthorName(data.authorName || 'Arun Regmi');
          setShortDescription(data.shortDescription || '');
          setPublished(data.published !== false);
          setSeoTitle(data.seoTitle || '');
          setSeoDescription(data.seoDescription || '');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;
    setSaving(true);
    try {
      const storageRef = ref(storage, `blog/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setThumbnailUrl(url);
    } catch (error) {
       alert("Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'posts', id), {
        title,
        slug,
        category,
        readTime,
        thumbnail: thumbnailUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        authorName,
        shortDescription,
        content,
        published,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || shortDescription,
      });
      router.push('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-black text-[#00f0ff] font-bold">Loading Editor...</div>;

  return (
     <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />

      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a]">
        <div className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><FaEdit size={16}/></span>
            Edit Article
          </h1>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setPreviewMode(!previewMode)}
               className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold"
             >
               {previewMode ? <><FaEdit /> Editor</> : <><FaEye /> Preview</>}
             </button>
             <button onClick={handleSubmit} disabled={saving} className="bg-[#00f0ff] text-black px-8 py-2 font-black rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50 text-sm">
               {saving ? 'Saving...' : 'Update Post'}
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            <div className="xl:col-span-2 space-y-8">
              {previewMode ? (
                 <div className="glass p-10 rounded-3xl border border-white/10 min-h-[800px]">
                    <article className="max-w-none">
                       <header className="mb-12 text-center text-white">
                         <h1 className="text-5xl font-black mb-6">{title}</h1>
                         <div className="flex justify-center gap-4 text-sm font-bold text-[#00f0ff] uppercase tracking-widest">
                            <span>{category}</span> &middot; <span>{readTime}</span>
                         </div>
                       </header>
                       {thumbnailUrl && (
                         <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
                           <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumb" />
                         </div>
                       )}
                       <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-[#00f0ff] prose-img:rounded-3xl">
                         <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                           {content}
                         </ReactMarkdown>
                       </div>
                    </article>
                 </div>
              ) : (
                <>
                  <section className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                    <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Core Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Post Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required 
                               className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#00f0ff] text-xl font-bold transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">URL Slug</label>
                          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} 
                                 className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-[#00f0ff]" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Category</label>
                          <select value={category} onChange={e => setCategory(e.target.value)} 
                                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00f0ff]">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 mb-2 block uppercase tracking-wider">Short Description</label>
                        <textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} rows={3}
                                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-[#00f0ff] text-sm resize-none" />
                      </div>
                    </div>
                  </section>

                  <section className="flex flex-col h-[700px] glass rounded-3xl border border-white/10 overflow-hidden">
                    <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/[0.02]">
                       <button onClick={() => insertText('**', '**')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaBold size={14}/></button>
                       <button onClick={() => insertText('*', '*')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaItalic size={14}/></button>
                       <button onClick={() => insertText('# ')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaHeading size={14}/></button>
                       <div className="w-px h-6 bg-white/10 mx-2" />
                       <button onClick={() => insertText('- ')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaListUl size={14}/></button>
                       <button onClick={() => insertText('[', '](url)')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaLink size={14}/></button>
                       <button onClick={() => insertText('![alt](', ')')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaImage size={14}/></button>
                       <button onClick={() => insertText('```\n', '\n```')} className="p-2 hover:bg-white/10 rounded text-gray-400"><FaCode size={14}/></button>
                    </div>
                    <textarea 
                      id="markdown-editor"
                      value={content} 
                      onChange={e => setContent(e.target.value)} 
                      required 
                      className="w-full flex-1 bg-transparent p-8 text-gray-300 font-mono text-sm focus:outline-none leading-relaxed resize-none custom-scrollbar" 
                    />
                  </section>
                </>
              )}
            </div>

            <aside className="space-y-8">
               <section className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-white text-sm font-black uppercase tracking-widest">Media & Featured</h3>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video bg-black/40 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#00f0ff]/50 transition-all group overflow-hidden"
                  >
                     {thumbnailUrl ? (
                        <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumb" />
                     ) : (
                        <FaImage className="text-3xl text-gray-600 group-hover:text-[#00f0ff]" />
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  <input type="text" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="Or paste external URL"
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white focus:outline-none focus:border-[#00f0ff]" />
               </section>

               <section className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-white text-sm font-black uppercase tracking-widest">Post Settings</h3>
                  <div className="space-y-4">
                     <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Author" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                     <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold text-gray-300">Published</span>
                        <button onClick={() => setPublished(!published)} className={`w-12 h-6 rounded-full transition-all relative ${published ? 'bg-[#00f0ff]' : 'bg-gray-700'}`}>
                           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${published ? 'right-1' : 'left-1'}`} />
                        </button>
                     </div>
                  </div>
               </section>

               <section className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-[#00f0ff] text-sm font-black uppercase tracking-widest">SEO Config</h3>
                  <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="SEO Title" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                  <textarea value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={3} placeholder="SEO Description" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white resize-none" />
               </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
