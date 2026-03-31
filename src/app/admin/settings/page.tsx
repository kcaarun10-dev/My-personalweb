"use client";

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { FaSave, FaTools, FaGlobe, FaUserAlt, FaEnvelope, FaLink, FaBars } from 'react-icons/fa';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Global Settings State
  const [siteName, setSiteName] = useState('ArunTech');
  const [siteDescription, setSiteDescription] = useState('Everything Tech & Dev');
  const [logoUrl, setLogoUrl] = useState('');
  const [authorName, setAuthorName] = useState('Arun Regmi');
  const [contactEmail, setContactEmail] = useState('kcaarun10@gmail.com');
  const [socialLinks, setSocialLinks] = useState({
     twitter: 'https://twitter.com/regmi_rays',
     instagram: 'https://instagram.com/regmi.rays10',
     linkedin: 'https://linkedin.com/in/arun-regmi'
  });
  const [footerText, setFooterText] = useState('ArunTech Blog & Media. All rights reserved.');

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'kcaarun10@gmail.com') {
        router.push('/admin');
      }
    });
    fetchSettings();
    return () => unsubscribe();
  }, [router]);

  const fetchSettings = async () => {
    if (!db) return;
    try {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) {
        const data = snap.data();
        setSiteName(data.siteName || '');
        setSiteDescription(data.siteDescription || '');
        setLogoUrl(data.logoUrl || '');
        setAuthorName(data.authorName || '');
        setContactEmail(data.contactEmail || '');
        setSocialLinks(data.socialLinks || {});
        setFooterText(data.footerText || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), {
        siteName, siteDescription, logoUrl, authorName, contactEmail, socialLinks, footerText,
        updatedAt: Date.now()
      });
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-black text-[#00f0ff] font-bold">Configuring Dashboard...</div>;

  return (
    <div className="fixed inset-0 z-[60] flex bg-[#050505] overflow-hidden w-full h-[100dvh]">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-full bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
         <div className="px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <span className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><FaTools /></span>
               Global Configuration
            </h1>
            <button onClick={handleSave} disabled={saving} className="bg-[#00f0ff] text-black px-8 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 shadow-2xl">
               <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
         </div>

         <div className="p-8 max-w-5xl mx-auto w-full space-y-10 pb-20">
            {/* Site Branding */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-8">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <FaGlobe className="opacity-50" /> Website Branding
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-500 uppercase">Website Name</label>
                     <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00f0ff]" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-500 uppercase">Tagline / Description</label>
                     <input type="text" value={siteDescription} onChange={e => setSiteDescription(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00f0ff]" />
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase">Logo URL</label>
                  <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00f0ff]" />
               </div>
            </section>

            {/* Author & Contact Info */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-8">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <FaUserAlt className="opacity-50" /> Master Author Profile
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-500 uppercase">Default Author Identity</label>
                     <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#00f0ff]" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-500 uppercase">Contact Email Pointer</label>
                     <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                               className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00f0ff]" />
                     </div>
                  </div>
               </div>
            </section>

            {/* Social & Connectivity */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-8">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                  <FaLink className="opacity-50" /> Social Integrations
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.keys(socialLinks).map((key) => (
                    <div key={key} className="space-y-3">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{key}</label>
                       <input 
                         type="text" 
                         value={(socialLinks as any)[key]} 
                         onChange={e => setSocialLinks({...socialLinks, [key]: e.target.value})}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
                       />
                    </div>
                  ))}
               </div>
            </section>

            {/* Footer Attribution */}
            <section className="glass p-10 rounded-[40px] border border-white/10 space-y-4">
               <h2 className="text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Footer Text Signature</h2>
               <textarea value={footerText} onChange={e => setFooterText(e.target.value)} rows={3}
                         className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-[#00f0ff] resize-none text-sm leading-relaxed" />
            </section>

         </div>
      </div>
    </div>
  );
}
