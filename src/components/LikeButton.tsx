"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

export default function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId || !db) return;
    const fetchLikes = async () => {
      const docRef = doc(db, 'likes', postId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setLikes(snap.data().count || 0);
      }
    };
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
    if (hasLiked || loading || !db) return;
    setLoading(true);
    
    // Optimistic UI update
    setLikes(prev => prev + 1);
    setHasLiked(true);

    try {
      const docRef = doc(db, 'likes', postId);
      const snap = await getDoc(docRef);
      
      if (snap.exists()) {
        await updateDoc(docRef, { count: increment(1) });
      } else {
        await setDoc(docRef, { count: 1 });
      }
    } catch (error) {
       console.error("Error liking post", error);
       setLikes(prev => prev - 1);
       setHasLiked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={hasLiked || loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
        hasLiked 
          ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' 
          : 'bg-transparent border-gray-600 text-gray-400 hover:border-[#00f0ff] hover:text-[#00f0ff]'
      }`}
    >
      <svg className="w-5 h-5" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.514" />
      </svg>
      <span className="font-semibold">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}
