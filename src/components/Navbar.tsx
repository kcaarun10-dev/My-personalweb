"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/blog" className="text-2xl font-bold tracking-tighter">
              Arun<span className="text-primary-accent text-[#00f0ff]">Tech</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Portfolio</Link>
              <Link href="/blog" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
              <Link href="/categories/mobile" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Mobile</Link>
              <Link href="/categories/ai" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">AI</Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 py-8 space-y-4 bg-black/95 backdrop-blur-3xl min-h-screen">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-xl font-bold hover:text-[#00f0ff]">Portfolio</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="block text-xl font-bold hover:text-[#00f0ff]">Blog</Link>
          <hr className="border-white/10" />
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Categories</p>
          <Link href="/categories/mobile" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">Mobile</Link>
          <Link href="/categories/ai" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">AI</Link>
          <Link href="/categories/web-dev" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">Web Dev</Link>
          <Link href="/categories/gadgets" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">Gadgets</Link>
          <hr className="border-white/10" />
          <Link href="/about" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">About Us</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-lg hover:text-[#00f0ff]">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
