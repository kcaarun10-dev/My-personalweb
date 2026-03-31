"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Post } from '@/types';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { FcGoogle } from 'react-icons/fc';
import { FaFileAlt, FaComment, FaFolder, FaEye, FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      if (currentUser && currentUser.email !== 'kcaarun10@gmail.com') {
        await signOut(auth);
        setUser(null);
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc')));
      const fetchedPosts = postsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(fetchedPosts);

      const commentsSnap = await getDocs(collection(db, 'comments'));
      setComments(commentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'kcaarun10@gmail.com') {
        await signOut(auth);
        alert("Access Denied");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this post?")) {
      await deleteDoc(doc(db, 'posts', id));
      fetchData();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="glass p-12 rounded-[40px] w-full max-w-md text-center space-y-8 border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-[#00f0ff]/10 rounded-3xl flex items-center justify-center mx-auto text-[#00f0ff] animate-pulse">
             <FaFileAlt size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">ArunTech Admin</h1>
            <p className="text-gray-500 mt-2 font-medium">Authentication Required</p>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-black py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-3 shadow-xl"
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // Stats Logic
  const publishedPosts = posts.filter(p => p.published).length;
  const draftPosts = posts.filter(p => !p.published).length;
  const totalCategories = Array.from(new Set(posts.map(p => p.category))).length;
  const totalViews = posts.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 z-20 px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm font-medium">Insight into your digital footprint.</p>
            </div>
            <Link href="/admin/create" className="bg-[#00f0ff] text-black px-6 py-3 font-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 text-sm">
              <FaPlus /> New Article
            </Link>
        </div>

        <div className="p-8 space-y-12">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard icon={<FaFileAlt />} label="Total Posts" value={posts.length} color="text-[#00f0ff]" />
            <StatCard icon={<FaFileAlt className="opacity-50" />} label="Published" value={publishedPosts} color="text-green-500" />
            <StatCard icon={<FaFileAlt className="opacity-50" />} label="Drafts" value={draftPosts} color="text-yellow-500" />
            <StatCard icon={<FaComment />} label="Comments" value={comments.length} color="text-purple-500" />
            <StatCard icon={<FaFolder />} label="Categories" value={totalCategories} color="text-blue-500" />
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 gap-10">
            <section className="space-y-6">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-[#00f0ff] rounded-full"></span>
                     Recent Articles
                  </h2>
                  <div className="relative w-full md:w-80">
                     <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                     <input 
                       type="text" 
                       placeholder="Search articles or categories..." 
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-300 focus:outline-none focus:border-[#00f0ff] transition-all"
                     />
                  </div>
               </div>

               <div className="glass rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                 <table className="w-full text-left">
                   <thead className="bg-white/[0.02] border-b border-white/10">
                     <tr>
                       <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Article Details</th>
                       <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Category</th>
                       <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Status</th>
                       <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest">Engagement</th>
                       <th className="p-6 font-bold text-gray-400 text-xs uppercase tracking-widest text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {filteredPosts.map(post => (
                       <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="p-6">
                           <div className="font-bold text-white mb-1 group-hover:text-[#00f0ff] transition-colors">{post.title}</div>
                           <div className="text-[10px] text-gray-500 font-mono uppercase tracking-tight">{new Date(post.createdAt).toLocaleDateString()}</div>
                         </td>
                         <td className="p-6">
                           <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-gray-400">
                             {post.category}
                           </span>
                         </td>
                         <td className="p-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${post.published ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                             {post.published ? 'Published' : 'Draft'}
                           </span>
                         </td>
                         <td className="p-6">
                           <div className="flex items-center gap-2 text-gray-400">
                              <FaEye size={12} className="text-[#00f0ff]" />
                              <span className="text-xs font-bold font-mono">{post.viewCount || 0}</span>
                           </div>
                         </td>
                         <td className="p-6 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all"><FaEye size={14}/></Link>
                             <Link href={`/admin/edit/${post.id}`} className="p-2 bg-white/5 rounded-lg text-[#00f0ff] hover:bg-[#00f0ff]/10 transition-all"><FaEdit size={14}/></Link>
                             <button onClick={() => handleDelete(post.id!)} className="p-2 bg-white/5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"><FaEdit size={14}/></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/10 hover:border-[#00f0ff]/30 transition-all group">
      <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}
