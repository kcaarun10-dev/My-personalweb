"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaFolder } from 'react-icons/fa';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
      }
    });
    fetchCategories();
    return () => unsubscribe();
  }, [router]);

  const fetchCategories = async () => {
    if (!db) return;
    const snap = await getDocs(collection(db, 'categories'));
    setCategories(snap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !db) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'categories'), { name: newCategory.trim() });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this category?")) {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim() || !db) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'categories', id), { name: editingName.trim() });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a]">
         <div className="px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><FaFolder /></span>
               Manage Categories
            </h1>
         </div>

         <div className="p-8 max-w-4xl space-y-10">
            <section className="glass p-8 rounded-3xl border border-white/10 space-y-6">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.3em]">Add New Category</h2>
               <form onSubmit={handleAdd} className="flex gap-4">
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Enter category name..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                  <button type="submit" disabled={loading} className="bg-[#00f0ff] text-black px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50">
                     <FaPlus /> Add
                  </button>
               </form>
            </section>

            <section className="space-y-4">
               <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] pl-4">Existing Categories</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <div key={cat.id} className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:border-[#00f0ff]/50 transition-all">
                       {editingId === cat.id ? (
                          <input 
                             autoFocus
                             className="bg-white/5 border border-[#00f0ff] text-white px-3 py-1 rounded-lg outline-none w-full mr-4"
                             value={editingName}
                             onChange={e => setEditingName(e.target.value)}
                             onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id)}
                          />
                       ) : (
                          <span className="text-white font-bold tracking-wide">{cat.name}</span>
                       )}
                       
                       <div className="flex gap-2">
                          {editingId === cat.id ? (
                             <>
                                <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><FaSave/></button>
                                <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><FaTimes/></button>
                             </>
                          ) : (
                             <>
                                <button onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }} className="p-2 text-gray-500 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><FaEdit/></button>
                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><FaTrash/></button>
                             </>
                          )}
                       </div>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-gray-500 text-sm italic p-4">No categories added yet.</p>}
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
