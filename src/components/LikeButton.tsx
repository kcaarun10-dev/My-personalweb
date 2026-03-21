"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from 'firebase/firestore';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export default function LikeButton({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const storageKey = `liked_${postId}`;

  useEffect(() => {
    if (!postId || !db) return;

    // 1. Check LocalStorage for persistence (one like per browser)
    const localLiked = localStorage.getItem(storageKey);
    if (localLiked) setHasLiked(true);

    // 2. Real-time listener for the like count
    const docRef = doc(db, 'likes', postId);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setLikes(snap.data().count || 0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId, storageKey]);

  const handleLike = async () => {
    // Prevent double liking from the same browser
    if (hasLiked || !db) return;
    
    // 3. Optimistic local Update
    setHasLiked(true);
    localStorage.setItem(storageKey, 'true');

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
       // Revert on failure
       setHasLiked(false);
       localStorage.removeItem(storageKey);
    }
  };

  if (loading) return <div className="h-10 w-24 bg-white/5 animate-pulse rounded-full"></div>;

  return (
    <div className="flex flex-col items-start space-y-2">
      <button 
        onClick={handleLike} 
        disabled={hasLiked}
        className={`group flex items-center space-x-3 px-6 py-2.5 rounded-full border transition-all duration-300 ${
          hasLiked 
            ? 'glass border-[#00f0ff] text-[#00f0ff] cursor-default shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
            : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 hover:text-[#00f0ff] active:scale-95'
        }`}
      >
        <div className={`transition-transform duration-300 ${!hasLiked && 'group-hover:scale-125'}`}>
           {hasLiked ? <AiFillLike className="text-xl" /> : <AiOutlineLike className="text-xl" />}
        </div>
        <div className="flex flex-col items-start leading-none">
           <span className="text-sm font-black tracking-wider uppercase">
              {hasLiked ? 'Appreciated' : 'Like'}
           </span>
           <span className="text-[10px] font-mono opacity-50">
              {likes.toLocaleString()} Support
           </span>
        </div>
      </button>
      {hasLiked && (
         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest pl-4 animate-fade-in">Thank you for your feedback!</p>
      )}
    </div>
  );
}
