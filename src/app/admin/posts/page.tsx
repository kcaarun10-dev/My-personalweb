"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Post } from '@/types';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { FaSearch, FaFilter, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this article?")) {
      await deleteDoc(doc(db, 'posts', id));
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Published' ? p.published : !p.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(posts.map(p => p.category)));

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a]">
        <div className="px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
            <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
               Post Management
            </h1>
            <Link href="/admin/create" className="bg-[#00f0ff] text-black px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:scale-105 shadow-2xl transition-all">
               <FaPlus /> Draft New
            </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
           {/* Filters Toolbar */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
              <div className="md:col-span-2 relative">
                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Search by title..." 
                   className="w-full bg-black/40 border-none rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-[#00f0ff]" 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="relative">
                 <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <select 
                   value={categoryFilter}
                   onChange={e => setCategoryFilter(e.target.value)}
                   className="w-full bg-black/40 border-none rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-[#00f0ff]"
                 >
                   <option>All Categories</option>
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div className="relative">
                 <select 
                   value={statusFilter}
                   onChange={e => setStatusFilter(e.target.value)}
                   className="w-full bg-black/40 border-none rounded-2xl py-3 px-4 text-sm text-white focus:ring-1 focus:ring-[#00f0ff]"
                 >
                   <option>All Status</option>
                   <option>Published</option>
                   <option>Draft</option>
                 </select>
              </div>
           </div>

           {/* Table */}
           <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
              <table className="w-full text-left">
                <thead>
                   <tr className="bg-white/5 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/10">
                      <th className="p-6">Article</th>
                      <th className="p-6">Topic</th>
                      <th className="p-6">Status</th>
                      <th className="p-6">Performance</th>
                      <th className="p-6 text-right">Settings</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {filteredPosts.map(post => (
                     <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                           <div className="font-bold text-white mb-0.5">{post.title}</div>
                           <div className="text-[10px] text-gray-600 font-mono">{post.slug}</div>
                        </td>
                        <td className="p-6">
                           <span className="px-3 py-1 rounded-full bg-[#00f0ff]/5 border border-[#00f0ff]/20 text-[10px] font-black uppercase text-[#00f0ff]">
                              {post.category}
                           </span>
                        </td>
                        <td className="p-6">
                           {post.published ? (
                             <span className="flex items-center gap-1.5 text-xs text-green-500 font-bold"><FaCheckCircle className="opacity-50" /> Published</span>
                           ) : (
                             <span className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold"><FaExclamationCircle className="opacity-50" /> Draft</span>
                           )}
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                              <FaEye className="text-[#00f0ff]/50" /> {post.viewCount || 0} hits
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/blog/${post.slug}`} target="_blank" className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-white"><FaEye size={16}/></Link>
                              <Link href={`/admin/edit/${post.id}`} className="p-2.5 bg-white/5 rounded-xl text-blue-400 hover:bg-blue-500/10"><FaEdit size={16}/></Link>
                              <button onClick={() => handleDelete(post.id!)} className="p-2.5 bg-white/5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"><FaTrash size={16}/></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                   {filteredPosts.length === 0 && (
                     <tr><td colSpan={5} className="p-20 text-center text-gray-600 font-medium italic">No articles found matching your criteria.</td></tr>
                   )}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
