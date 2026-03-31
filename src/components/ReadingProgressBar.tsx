"use client";

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setCompletion(+(currentProgress / scrollHeight).toFixed(2) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#00f0ff] via-blue-500 to-[#00f0ff] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(0,240,255,0.7)]" 
        style={{ width: `${completion}%` }}
      />
    </div>
  );
}
