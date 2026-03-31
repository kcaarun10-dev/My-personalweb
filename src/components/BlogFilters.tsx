'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function BlogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [categories, setCategories] = useState(['All']);

  // Real-time Categories from DB
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => doc.data().name);
      setCategories(['All', ...list]);
    });
    return () => unsubscribe();
  }, []);

  // Debounced search for faster feel (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get('q') || '';
      if (search === currentQuery) return; // Prevent redundant push

      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('q', search);
      } else {
        params.delete('q');
      }
      router.push(`/blog?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, router, searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-12 space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search articles, reviews, and leaks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pl-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]/50 transition-all shadow-2xl"
        />
        <svg 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" 
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
              activeCategory === category
                ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
