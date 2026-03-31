"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, where, onSnapshot, updateDoc, doc, increment, 
  arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { Comment, Report } from '@/types';
import { IoSend } from 'react-icons/io5';
import { 
  FaUserCircle, FaThumbsUp, FaThumbsDown, FaReply, 
  FaExclamationTriangle, FaGoogle 
} from 'react-icons/fa';

export default function Comments({ postId }: { postId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!postId || !db) return;
    const q = query(collection(db, 'comments'), where('postId', '==', postId));

    const unsubscribe = onSnapshot(q, (snap: any) => {
      const fetched: Comment[] = snap.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      setComments(fetched.sort((a, b) => b.createdAt - a.createdAt));
    });

    return () => unsubscribe();
  }, [postId]);

  const handleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // Simple user cancellation, no need to log as error
        return;
      }
      console.error("Login failed:", error);
    }
  };

  const handleReaction = async (comment: Comment, type: 'likes' | 'dislikes') => {
    if (!user) {
      alert("Sign in to react to comments.");
      return;
    }
    if (!comment.id || !db) return;

    // Check if user already reacted
    const alreadyLiked = comment.likedBy?.includes(user.uid);
    const alreadyDisliked = comment.dislikedBy?.includes(user.uid);

    if (alreadyLiked || alreadyDisliked) {
      alert("You can only react once per comment.");
      return;
    }

    try {
      const commentRef = doc(db, 'comments', comment.id);
      await updateDoc(commentRef, {
        [type]: increment(1),
        [type === 'likes' ? 'likedBy' : 'dislikedBy']: arrayUnion(user.uid)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!user) {
      handleLogin();
      return;
    }
    const text = parentId ? replyText : newComment;
    if (!text.trim() || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        authorName: user.displayName || "Anonymous",
        authorId: user.uid,
        authorPhoto: user.photoURL || null,
        text: text,
        createdAt: Date.now(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        parentId: parentId || null
      });
      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (comment: Comment) => {
    if (!db || !comment.id) return;
    if (!confirm("Are you sure you want to report this comment for moderation?")) return;
    
    try {
      await addDoc(collection(db, 'reports'), {
        commentId: comment.id,
        commentText: comment.text,
        reason: "User Reported",
        createdAt: Date.now(),
        status: 'pending'
      } as Report);
      alert("Comment reported.");
    } catch (e) {
       console.error(e);
    }
  };

  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="mt-16 w-full max-w-4xl mx-auto border-t border-white/5 pt-12">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-black text-white tracking-tight">Technical Discussion</h3>
        <span className="bg-[#00f0ff]/10 text-[#00f0ff] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-[#00f0ff]/20">
          {comments.length} Conversations
        </span>
      </div>

      {!user ? (
        <div className="glass p-10 rounded-[32px] border border-dashed border-white/10 text-center space-y-6 mb-14">
           <div>
             <h4 className="text-xl font-bold text-white">Join the Discussion</h4>
             <p className="text-gray-500 text-sm mt-1">Sign in to share your technical take and interact with others.</p>
           </div>
           <button 
             onClick={handleLogin}
             className="bg-white text-black font-black px-10 py-4 rounded-2xl flex items-center gap-3 animate-gradient hover:scale-105 transition-all mx-auto shadow-2xl"
           >
             <FaGoogle /> Sign in with Google
           </button>
        </div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-14 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00f0ff] to-[#006aff] rounded-2xl blur opacity-15 group-hover:opacity-20 transition-opacity"></div>
          <div className="relative glass p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <img src={user.photoURL || ''} alt={"user"} className="w-8 h-8 rounded-full border border-white/10" />
               <span className="text-gray-300 font-bold text-sm">Commenting as {user.displayName}</span>
            </div>
            <textarea
              placeholder="What's your take on this topic?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-[#00f0ff] text-white resize-none transition-all placeholder:text-gray-600"
              required
            />
            <button type="submit" disabled={isSubmitting} className="flex items-center justify-center space-x-3 bg-white text-black font-black rounded-xl px-10 py-4 hover:bg-[#00f0ff] transition-all disabled:opacity-50 shadow-xl ml-auto">
              <span>{isSubmitting ? 'Posting...' : 'Post Thought'}</span> <IoSend />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-12 pb-20">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-20 glass rounded-32 border border-dashed border-white/10">
            <p className="text-gray-500 italic">No thoughts shared yet. Be the first!</p>
          </div>
        ) : (
          topLevelComments.map(comment => (
            <CommentItem 
               key={comment.id} 
               comment={comment} 
               allComments={comments}
               onReply={(id) => setReplyingTo(id)}
               replyingTo={replyingTo}
               setReplyingTo={setReplyingTo}
               replyText={replyText}
               setReplyText={setReplyText}
               onSendReply={handleSubmit}
               onReaction={handleReaction}
               onReport={handleReport}
               user={user}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({ 
  comment, 
  allComments, 
  onReply, 
  replyingTo, 
  setReplyingTo,
  replyText, 
  setReplyText, 
  onSendReply, 
  onReaction, 
  onReport, 
  user,
  depth = 0 
}: {
  comment: Comment;
  allComments: Comment[];
  onReply: (id: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onSendReply: (e: React.FormEvent, parentId: string) => void;
  onReaction: (comment: Comment, type: 'likes' | 'dislikes') => void;
  onReport: (comment: Comment) => void;
  user: User | null;
  depth?: number;
}) {
  const replies = allComments.filter(c => c.parentId === comment.id);
  const isReplying = replyingTo === comment.id;
  const hasLiked = comment.likedBy?.includes(user?.uid || '');
  const hasDisliked = comment.dislikedBy?.includes(user?.uid || '');

  return (
    <div className={`space-y-6 ${depth > 0 ? 'ml-6 md:ml-12 border-l border-white/5 pl-6 md:pl-10 mt-6' : ''}`}>
      <div className="group relative">
        <div className="flex items-start space-x-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#222] border border-white/5 flex items-center justify-center shadow-2xl relative group-hover:border-[#00f0ff]/30 transition-all font-black text-white text-xl overflow-hidden shrink-0">
             {comment.authorPhoto ? <img src={comment.authorPhoto} alt={"A"} className="w-full h-full object-cover" /> : comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-bold text-lg text-white group-hover:text-[#00f0ff] transition-colors truncate">{comment.authorName}</h4>
              <time className="text-[10px] font-black text-gray-600 uppercase tracking-widest shrink-0">{new Date(comment.createdAt).toLocaleDateString()}</time>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed group-hover:bg-white/[0.07] transition-all break-words">
              {comment.text}
            </div>
            <div className="flex items-center space-x-6 text-[10px] font-black text-gray-500 pl-2 uppercase tracking-tight overflow-x-auto no-scrollbar py-1">
              <button 
                onClick={() => onReaction(comment, 'likes')}
                disabled={hasLiked || hasDisliked}
                className={`flex items-center space-x-2 ${hasLiked ? 'text-[#00f0ff]' : 'hover:text-[#00f0ff]'} transition-colors disabled:opacity-50`}
              >
                <FaThumbsUp /> <span>{comment.likes || 0}</span>
              </button>
              <button 
                onClick={() => onReaction(comment, 'dislikes')}
                disabled={hasLiked || hasDisliked}
                className={`flex items-center space-x-2 ${hasDisliked ? 'text-red-500' : 'hover:text-red-500'} transition-colors disabled:opacity-50`}
              >
                <FaThumbsDown /> <span>{comment.dislikes || 0}</span>
              </button>
              <button onClick={() => onReply(comment.id!)} className="flex items-center space-x-2 hover:text-white transition-colors">
                <FaReply /> <span>Reply</span>
              </button>
              <button onClick={() => onReport(comment)} className="flex items-center space-x-2 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <FaExclamationTriangle /> <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-10 md:ml-16 glass p-6 rounded-2xl border border-[#00f0ff]/20 animate-in fade-in slide-in-from-top-2 z-10 relative">
          {!user ? (
            <p className="text-gray-500 text-xs italic">Sign in to reply.</p>
          ) : (
            <>
              <textarea
                placeholder={`Replying as ${user.displayName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-black/40 border-none rounded-xl p-4 text-white focus:ring-0 text-sm placeholder:text-gray-600 resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-4">
                 <button onClick={() => setReplyingTo(null)} className="px-4 py-2 text-[10px] font-black uppercase text-gray-500 hover:text-white">Cancel</button>
                 <button onClick={(e) => onSendReply(e, comment.id!)} className="px-6 py-2 bg-[#00f0ff] text-black text-[10px] font-black uppercase rounded-lg shadow-xl">Post Reply</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Recursive Replies */}
      {replies.length > 0 && (
         <div className="space-y-4">
            {replies.map(reply => (
              <CommentItem 
                key={reply.id}
                comment={reply}
                allComments={allComments}
                onReply={onReply}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                onSendReply={onSendReply}
                onReaction={onReaction}
                onReport={onReport}
                user={user}
                depth={depth + 1}
              />
            ))}
         </div>
      )}
    </div>
  );
}
