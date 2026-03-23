"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Post } from '@/types';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { FcGoogle } from 'react-icons/fc';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email !== 'kcaarun10@gmail.com') {
        await signOut(auth);
        setUser(null);
        return;
      }
      setUser(currentUser);
      if (currentUser) {
        fetchPosts();
        fetchComments();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    setPosts(fetchedPosts.sort((a, b) => b.createdAt - a.createdAt));
  };

  const fetchComments = async () => {
    const querySnapshot = await getDocs(collection(db, 'comments'));
    const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    setComments(fetchedComments.sort((a: any, b: any) => b.createdAt - a.createdAt));
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'kcaarun10@gmail.com') {
        await signOut(auth);
        alert("Access Denied: You are not authorized to access this dashboard.");
        return;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to login with Google");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteDoc(doc(db, 'posts', id));
      fetchPosts();
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm("Delete this comment permanently?")) {
      try {
        await deleteDoc(doc(db, 'comments', id));
        fetchComments();
      } catch (err: any) {
        console.error(err);
        alert(`Failed to delete comment! Firebase Error: ${err.message}. Please make sure your Firebase Rules are updated in your dashboard and match what was provided.`);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass p-10 rounded-2xl w-full max-w-md flex flex-col space-y-6 items-center text-center">
          {!auth && <div className="bg-red-500/20 text-red-500 p-3 rounded text-sm w-full">Firebase is not configured. Please add .env.local variables!</div>}

          <div>
            <h1 className="text-3xl font-extrabold text-[#00f0ff] tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 mt-2 text-sm">Sign in to manage your content</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={!auth}
            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <FcGoogle className="text-2xl" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // Total Views Calculation (Mocked via Likes or placeholder if no views field exists)
  const totalViews = posts.reduce((acc, curr) => acc + (curr.readTime ? parseInt(curr.readTime) * 10 : 50), 0);

  return (
    <div className="fixed inset-0 z-[60] flex bg-black overflow-y-auto w-full h-[100dvh]">
      {/* Sidebar hidden on mobile, full height on desktop */}
      <AdminSidebar />

      <div className="flex-1 md:ml-64 p-8 pt-24 md:pt-8 bg-[#0a0a0a] min-h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Dashboard Overview</h1>
            <p className="text-gray-400 mt-2">Welcome back to the ArunTech administration panel.</p>
          </div>
          <Link href="/admin/create" className="bg-[#00f0ff] text-black px-6 py-3 font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
            + Quick Post
          </Link>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass p-6 rounded-xl border-l-4 border-[#00f0ff]">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Published Posts</h3>
            <p className="text-5xl font-bold text-white mt-2">{posts.length}</p>
          </div>
          <div className="glass p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Estimated Total Views</h3>
            <p className="text-5xl font-bold text-white mt-2">{totalViews.toLocaleString()}</p>
          </div>
          <div className="glass p-6 rounded-xl border-l-4 border-purple-500">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Active Comments</h3>
            <p className="text-5xl font-bold text-white mt-2">{comments.length}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Manage Recent Content</h2>
        <div className="glass rounded-xl overflow-hidden shadow-2xl border border-white/5">
          <table className="w-full text-left">
            <thead className="bg-[#00f0ff]/10">
              <tr>
                <th className="p-4 font-semibold text-[#00f0ff]">Article Title</th>
                <th className="p-4 font-semibold text-[#00f0ff]">Category</th>
                <th className="p-4 font-semibold text-[#00f0ff]">Published Date</th>
                <th className="p-4 font-semibold text-[#00f0ff] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-gray-200">{post.title}</td>
                  <td className="p-4"><span className="text-xs font-bold uppercase tracking-wider bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-3 py-1 rounded-full text-[#00f0ff]">{post.category}</span></td>
                  <td className="p-4 text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-4">
                    <Link href={`/admin/edit/${post.id}`} className="text-[#00f0ff] hover:text-white transition-colors font-medium">Edit</Link>
                    <button onClick={() => handleDelete(post.id as string)} className="text-red-500 hover:text-white transition-colors font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No posts published yet. Time to start writing!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Community Moderation Section */}
        <h2 className="text-2xl font-bold text-white mb-6 mt-16 border-b border-gray-800 pb-4">Community Moderation</h2>
        <div className="glass rounded-xl overflow-hidden shadow-2xl border border-white/5 mb-20">
          <table className="w-full text-left">
            <thead className="bg-[#00f0ff]/10">
              <tr>
                <th className="p-4 font-semibold text-[#00f0ff] w-1/4">User</th>
                <th className="p-4 font-semibold text-[#00f0ff] w-1/2">Comment Text</th>
                <th className="p-4 font-semibold text-[#00f0ff]">Date</th>
                <th className="p-4 font-semibold text-[#00f0ff] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => {
                const relatedPost = posts.find((p: any) => p.id === comment.postId);
                const postUrl = relatedPost ? `/blog/${relatedPost.slug}` : '#';
                return (
                  <tr key={comment.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-200">{comment.authorName}</div>
                      <Link href={postUrl} className="text-xs text-[#00f0ff] opacity-70 hover:opacity-100">{relatedPost ? 'View Post ↑' : '(Deleted Post)'}</Link>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {comment.text.length > 80 ? comment.text.substring(0, 80) + '...' : comment.text}
                    </td>
                    <td className="p-4 text-gray-400 text-sm">{new Date(comment.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:text-white transition-colors font-medium">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {comments.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400">No comments yet. Your community is quiet!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
