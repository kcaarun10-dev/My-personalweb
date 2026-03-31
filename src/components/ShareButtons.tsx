"use client";

import React from 'react';

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export default function ShareButtons({ title }: ShareButtonsProps) {
  const shareTwitter = () => {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Share:</span>
      <button 
        onClick={shareTwitter}
        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] transition-all border border-white/10"
        aria-label="Share on X (Twitter)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
      </button>
      <button 
        onClick={shareFacebook}
        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600/10 hover:text-blue-500 transition-all border border-white/10"
        aria-label="Share on Facebook"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </button>
    </div>
  );
}
