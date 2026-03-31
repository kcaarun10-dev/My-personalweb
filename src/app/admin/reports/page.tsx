"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Report } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { FaExclamationTriangle, FaTrash, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
      }
    });
    fetchReports();
    return () => unsubscribe();
  }, [router]);

  const fetchReports = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    await updateDoc(doc(db, 'reports', id), { status: 'resolved' });
    fetchReports();
  };

  const handleDeleteReport = async (id: string) => {
    if (confirm("Delete this report entry?")) {
      await deleteDoc(doc(db, 'reports', id));
      fetchReports();
    }
  };

  const handleDeleteComment = async (commentId: string, reportId: string) => {
    if (confirm("Permanently delete the reported comment? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'comments', commentId));
        await updateDoc(doc(db, 'reports', reportId), { status: 'resolved' });
        fetchReports();
        alert("Comment deleted and report marked as resolved.");
      } catch (e) {
        alert("Failed to delete comment. It might already be gone.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
         <div className="px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><FaExclamationTriangle /></span>
               Community Reports
            </h1>
         </div>

         <div className="p-8 space-y-6">
            {loading ? (
               <p className="text-gray-500 font-bold animate-pulse">Scanning for violations...</p>
            ) : reports.length === 0 ? (
               <div className="glass p-20 rounded-[40px] text-center border border-dashed border-white/10">
                  <p className="text-gray-500 italic">No reports found. Your community is behaving well!</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {reports.map(report => (
                    <div key={report.id} className={`glass p-8 rounded-[32px] border transition-all ${report.status === 'resolved' ? 'border-white/5 opacity-60' : 'border-red-500/20'}`}>
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${report.status === 'resolved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {report.status}
                             </span>
                             <h3 className="text-white font-bold mt-4">Reported Content:</h3>
                          </div>
                          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{new Date(report.createdAt).toLocaleString()}</div>
                       </div>
                       
                       <blockquote className="bg-black/40 border-l-4 border-red-500 p-6 rounded-r-2xl italic text-gray-400 mb-8">
                          "{report.commentText}"
                       </blockquote>

                       <div className="flex flex-wrap gap-4">
                          {report.status === 'pending' && (
                             <>
                                <button 
                                   onClick={() => handleDeleteComment(report.commentId, report.id!)}
                                   className="bg-red-500 text-white px-6 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-red-600 transition-all"
                                >
                                   <FaTrash /> Delete Comment
                                </button>
                                <button 
                                   onClick={() => handleResolve(report.id!)}
                                   className="bg-white/10 text-white px-6 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-white/20 transition-all border border-white/10"
                                >
                                   <FaCheck /> Dismiss Report
                                </button>
                             </>
                          )}
                          <button 
                             onClick={() => handleDeleteReport(report.id!)}
                             className="p-3 text-gray-600 hover:text-white transition-all"
                             title="Remove Report Log"
                          >
                             <FaTrash size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
