"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', href: '/', icon: 'fa-house' },
    { name: 'Work', href: '/#work', icon: 'fa-briefcase' },
    { name: 'Blog', href: '/blog', icon: 'fa-blog' },
    { name: 'About', href: '/about', icon: 'fa-user-astronaut' },
    { name: 'Contact', href: '/#contact', icon: 'fa-paper-plane' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/10 py-2' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Arun Regmi Logo" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-[#00f0ff] transition-colors"
                >
                  <i className={`fa-solid ${link.icon} text-xs`}></i>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden fixed inset-0 top-[70px] bg-black/95 backdrop-blur-3xl transition-all duration-300 z-40 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 text-3xl font-bold hover:text-[#00f0ff] transition-colors"
            >
              <i className={`fa-solid ${link.icon} text-2xl`}></i>
              {link.name}
            </Link>
          ))}
          <div className="pt-8 flex space-x-12">
            <a href="mailto:kcaarun10@gmail.com" className="text-3xl hover:text-[#00f0ff]"><i className="fa-solid fa-envelope"></i></a>
            <a href="https://wa.me/9779810975653" className="text-3xl hover:text-green-500"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="https://instagram.com/regmi.rays10" className="text-3xl hover:text-pink-500"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </nav>
  );
}
