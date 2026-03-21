"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Comment } from '@/types';

export default function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!postId || !db) return;
    const q = query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched: Comment[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim() || !db) return;

    await addDoc(collection(db, 'comments'), {
      postId,
      authorName: name,
      text: newComment,
      createdAt: Date.now()
    });

    setNewComment("");
  };

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Discussion ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-8 glass p-6 rounded-xl flex flex-col space-y-4">
        <input 
          type="text" 
          placeholder="Your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white"
          required
        />
        <textarea 
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="bg-transparent border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] text-white resize-none"
          required
        />
        <button type="submit" className="bg-[#00f0ff] text-black font-semibold rounded-lg px-6 py-2 hover:bg-[#00e0ee] self-end transition-colors shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-blue-600 flex items-center justify-center font-bold text-black shadow-lg">
                {comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold block">{comment.authorName}</span>
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-gray-300 ml-13">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
