"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Comment } from '@/types';
import { IoSend } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!postId || !db) return;
    // Set up a real-time listener for the comments collection
    const q = query(
      collection(db, 'comments'), 
      where('postId', '==', postId), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched: Comment[] = snap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Comment));
      setComments(fetched);
    });
    
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim() || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        authorName: name,
        text: newComment,
        createdAt: Date.now()
      });
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 w-full max-w-4xl mx-auto border-t border-white/5 pt-12">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">Community Discussion</h3>
        <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-[#00f0ff]/20">
          {comments.length} Thoughts
        </span>
      </div>
      
      {/* Premium Form */}
      <form onSubmit={handleSubmit} className="mb-14 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#006aff] rounded-2xl blur opacity-15 group-hover:opacity-20 transition-opacity"></div>
        <div className="relative glass p-8 rounded-2xl border border-white/10 flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <FaUserCircle className="absolute left-3 top-3.5 text-gray-500 text-xl" />
              <input 
                type="text" 
                placeholder="Display Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white transition-all placeholder:text-gray-600"
                required
              />
            </div>
          </div>
          <div className="relative">
            <textarea 
              placeholder="Join the technical conversation... Share your take on this article."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pt-4 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white resize-none transition-all placeholder:text-gray-600"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="group/btn flex items-center justify-center space-x-3 bg-white text-black font-extrabold rounded-xl px-8 py-4 hover:bg-[#00f0ff] hover:text-black transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-xl"
          >
            <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            <IoSend className={`transition-transform group-hover/btn:translate-x-1 ${isSubmitting ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </form>

      {/* Optimized Comment List */}
      <div className="space-y-8 pb-20">
        {comments.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-dashed border-white/10">
             <p className="text-gray-500 italic text-xl">Be the first to spark a discussion!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="group relative">
               <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#222] border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-[#00f0ff]/30 transition-all">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                           {comment.authorName.charAt(0).toUpperCase()}
                        </span>
                        <div className="absolute inset-0 bg-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                  </div>
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-white group-hover:text-[#00f0ff] transition-colors">{comment.authorName}</h4>
                        <time className="text-xs font-mono text-gray-600 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                     </div>
                     <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed shadow-sm group-hover:shadow-md group-hover:bg-white/[0.07] transition-all">
                        {comment.text}
                     </div>
                     <div className="flex items-center space-x-6 text-xs font-bold text-gray-600 pl-2">
                        <button className="hover:text-[#00f0ff] uppercase tracking-tighter">Helpful</button>
                        <button className="hover:text-[#00f0ff] uppercase tracking-tighter">Report</button>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
