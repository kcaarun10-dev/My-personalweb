"use client";

import { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { FaUser, FaSave, FaCamera, FaIdCard, FaQuoteLeft, FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Profile State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [coverPic, setCoverPic] = useState('');
  const [socials, setSocials] = useState({
    facebook: '',
    instagram: '',
    github: ''
  });
  const [location, setLocation] = useState('');
  const [profilePos, setProfilePos] = useState({ x: 50, y: 50 });
  const [coverPos, setCoverPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
        return;
      }
      fetchProfile(user.uid);
    });
    return () => unsubscribe();
  }, [router]);

  const fetchProfile = async (uid: string) => {
    if (!db) return;
    const snap = await getDoc(doc(db, 'authors', uid));
    if (snap.exists()) {
      const data = snap.data();
      setName(data.name || '');
      setSlug(data.slug || '');
      setDesignation(data.designation || '');
      setBio(data.bio || '');
      setProfilePic(data.profilePic || '');
      setCoverPic(data.coverPic || '');
      setLocation(data.location || '');
      setSocials(data.socials || { facebook: '', instagram: '', github: '' });
      setProfilePos(data.profilePos || { x: 50, y: 50 });
      setCoverPos(data.coverPos || { x: 50, y: 50 });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file || !storage || !auth.currentUser) return;
    setSaving(true);
    try {
      const storageRef = ref(storage, `profiles/${auth.currentUser.uid}/${type}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (type === 'profile') setProfilePic(url);
      else setCoverPic(url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!db || !auth.currentUser) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'authors', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        name,
        slug,
        designation,
        bio,
        profilePic,
        coverPic,
        location,
        socials,
        profilePos,
        coverPos
      });
      alert("Profile updated!");
    } catch (e) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-black text-[#00f0ff] font-bold">Loading Profile...</div>;

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
        <div className="px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <span className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500"><FaUser /></span>
               Author Profile
            </h1>
            <button onClick={handleSave} disabled={saving} className="bg-[#00f0ff] text-black px-8 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 shadow-2xl">
               <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
        </div>

        <div className="p-8 max-w-5xl mx-auto w-full space-y-10 pb-20">
            {/* Visual Identity */}
            <section className="space-y-6">
                <div 
                  className="w-full h-64 rounded-[40px] bg-gradient-to-br from-gray-800 to-black border border-white/10 overflow-hidden relative group cursor-pointer"
                  onClick={() => coverInputRef.current?.click()}
                >
                   {coverPic ? <img src={coverPic} className="w-full h-full object-cover" style={{ objectPosition: `${coverPos.x}% ${coverPos.y}%` }} alt="Cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-600"><FaCamera size={40}/></div>}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold uppercase text-xs tracking-widest">Upload Cover</span>
                   </div>
                   <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                </div>
                
                {/* Cover URL and Position Adjusters */}
                <div className="flex flex-col md:flex-row items-center gap-4 -mt-10 mx-6 relative z-10">
                   <div className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-3 flex-1 w-full shadow-2xl">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Link:</span>
                      <input 
                        type="text" 
                        value={coverPic} 
                        onChange={e => setCoverPic(e.target.value)} 
                        placeholder="Paste cover URL..."
                        className="bg-transparent border-none text-xs text-blue-400 focus:outline-none flex-1 truncate"
                      />
                   </div>
                   <div className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-6 shadow-2xl">
                      <div className="flex flex-col gap-1">
                         <span className="text-[8px] font-black text-gray-500 uppercase">Vertical Adjust</span>
                         <input type="range" min="0" max="100" value={coverPos.y} onChange={e => setCoverPos({...coverPos, y: parseInt(e.target.value)})} className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]" />
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[8px] font-black text-gray-500 uppercase">Horizontal Adjust</span>
                         <input type="range" min="0" max="100" value={coverPos.x} onChange={e => setCoverPos({...coverPos, x: parseInt(e.target.value)})} className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]" />
                      </div>
                   </div>
                </div>

                <div className="flex translate-y-[-40px] px-10 items-end gap-8">
                   <div className="relative group">
                      <div 
                        className="w-40 h-40 rounded-full border-4 border-[#0a0a0a] bg-gray-900 overflow-hidden relative cursor-pointer shadow-2xl"
                        onClick={() => profileInputRef.current?.click()}
                      >
                         {profilePic ? <img src={profilePic} className="w-full h-full object-cover" style={{ objectPosition: `${profilePos.x}% ${profilePos.y}%` }} alt="Profile" /> : <div className="w-full h-full flex items-center justify-center text-gray-500"><FaUser size={40}/></div>}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <FaCamera className="text-white" />
                         </div>
                         <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profile')} />
                      </div>
                      
                      {/* Profile Adjusters */}
                      <div className="absolute -bottom-2 -right-2 flex flex-col gap-2 scale-90 group-hover:scale-100 transition-transform origin-top-left z-20">
                         <div className="bg-black border border-white/10 rounded-xl p-2 flex items-center gap-2 shadow-2xl w-48">
                            <span className="text-[8px] font-bold text-gray-500 uppercase">Link:</span>
                            <input 
                              type="text" 
                              value={profilePic} 
                              onChange={e => setProfilePic(e.target.value)} 
                              placeholder="URL..."
                              className="bg-transparent border-none text-[10px] text-blue-400 focus:outline-none flex-1 truncate"
                            />
                         </div>
                         <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-3 shadow-2xl w-48 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black text-gray-400 uppercase">Y-Axis (Up/Down)</span>
                                <input type="range" min="0" max="100" value={profilePos.y} onChange={e => setProfilePos({...profilePos, y: parseInt(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7]" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-[7px] font-black text-gray-400 uppercase">X-Axis (Left/Right)</span>
                                <input type="range" min="0" max="100" value={profilePos.x} onChange={e => setProfilePos({...profilePos, x: parseInt(e.target.value)})} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#a855f7]" />
                             </div>
                         </div>
                      </div>
                   </div>

                   <div className="mb-4 space-y-1">
                      <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        placeholder="Your Full Name"
                        className="bg-transparent border-none text-4xl font-black text-white focus:outline-none placeholder:text-gray-800"
                      />
                      <input 
                         type="text" 
                         value={designation} 
                         onChange={e => setDesignation(e.target.value)} 
                         placeholder="Designation (e.g. Lead Technical Writer)"
                         className="bg-transparent border-none text-cyan-500 font-bold tracking-widest uppercase text-xs focus:outline-none block w-full"
                      />
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2">
                           <span className="text-gray-600 text-[10px] font-black uppercase">Slug:</span>
                           <input 
                              type="text" 
                              value={slug} 
                              onChange={e => setSlug(e.target.value)} 
                              placeholder="arun-regmi"
                              className="bg-transparent border-b border-white/5 text-[#00f0ff] font-bold text-xs focus:outline-none focus:border-[#00f0ff]/30 transition-all"
                           />
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-gray-600 text-[10px] font-black uppercase">Location:</span>
                           <input 
                              type="text" 
                              value={location} 
                              onChange={e => setLocation(e.target.value)} 
                              placeholder="Kathmandu, Nepal"
                              className="bg-transparent border-b border-white/5 text-gray-400 font-bold text-xs focus:outline-none focus:border-gray-500/30 transition-all"
                           />
                        </div>
                      </div>
                   </div>
                </div>
            </section>

            {/* Biography */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-6 -mt-16">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><FaQuoteLeft className="opacity-50"/> Bio / Introduction</h2>
               <textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  rows={5}
                  placeholder="Tell your readers about yourself..."
                  className="w-full bg-black/20 border border-white/5 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-[#00f0ff]/30 transition-all resize-none leading-relaxed"
               />
            </section>

            {/* Social Handlers */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-8">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2"><FaIdCard className="opacity-50"/> Social Handlers</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                     <span className="flex items-center gap-2 text-xs font-bold text-gray-500"><FaFacebook className="text-blue-500"/> Facebook URL</span>
                     <input type="text" value={socials.facebook} onChange={e => setSocials({...socials, facebook: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" />
                  </div>
                  <div className="space-y-3">
                     <span className="flex items-center gap-2 text-xs font-bold text-gray-500"><FaInstagram className="text-pink-500"/> Instagram URL</span>
                     <input type="text" value={socials.instagram} onChange={e => setSocials({...socials, instagram: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" />
                  </div>
                  <div className="space-y-3">
                     <span className="flex items-center gap-2 text-xs font-bold text-gray-500"><FaGithub className="text-white"/> GitHub URL</span>
                     <input type="text" value={socials.github} onChange={e => setSocials({...socials, github: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white" />
                  </div>
               </div>
            </section>
        </div>
      </div>
    </div>
  );
}
