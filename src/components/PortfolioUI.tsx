"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PortfolioUI() {
  const [typedText, setTypedText] = useState("I'm a Web Developer");
  
  // Typing Effect
  useEffect(() => {
    const words = ["Web Developer", "UI/UX Designer", "Freelancer"];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let timeoutId: any;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        setTypedText(`I'm a ${currentWord.substring(0, letterIndex - 1)}`);
        letterIndex--;
        if (letterIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      } else {
        setTypedText(`I'm a ${currentWord.substring(0, letterIndex + 1)}`);
        letterIndex++;
        if (letterIndex === currentWord.length) isDeleting = true;
      }
      timeoutId = setTimeout(type, isDeleting ? 100 : 200);
    }
    
    type();
    return () => clearTimeout(timeoutId);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = 'running';
          if (entry.target.classList.contains('skills-container')) {
            const skillBars = entry.target.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
              const progress = bar.getAttribute('data-progress');
              (bar as HTMLElement).style.width = progress + '%';
            });
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .project-card, .skills-container');
    animatedElements.forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio-wrapper">
      <Header />
      
      <main>
        {/* Gallery / Hero */}
        <section className="home" id="home">
          <div className="home-content">
            <h1 className="text-[#00f0ff] font-extrabold mb-4">Arun Regmi</h1>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">Building web experiences that matter.</h2>
            <h3 className="typing-text text-2xl md:text-3xl text-gray-400 font-mono mb-8 h-8">{typedText}</h3>
            <p className="max-w-xl text-lg text-gray-400 mb-10 leading-relaxed">I design and develop fast, modern, and accessible websites and useful online tools. I focus on performance, simplicity, and delightful UX.</p>
            <div className="flex gap-4 flex-wrap">
              <a href="#contact" className="px-8 py-3 bg-[#00f0ff] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">Hire Me</a>
              <Link href="/blog" className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all">View Blog</Link>
            </div>
          </div>
          <div className="home-img mt-12 md:mt-0">
             <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden glass border border-white/10 shadow-3xl">
                <img src="/main.jpg" alt="Arun Regmi" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" />
             </div>
          </div>
        </section>

        {/* Selected Work */}
        <section id="work" className="py-32">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Selected <span className="text-[#00f0ff]">Work</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="project-card group">
              <div className="aspect-video bg-white/5 rounded-3xl mb-6 relative overflow-hidden boarder border-white/5 flex items-center justify-center">
                 <i className="fa-solid fa-tools text-6xl text-white/10 group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3">Online Tools Suite</h3>
              <p className="text-gray-400 mb-6">17+ high-performance utility tools built with vanilla JS and optimized for speed.</p>
              <Link href="/tools" className="text-[#00f0ff] font-bold hover:underline">Explore Tools &rarr;</Link>
            </div>
            <div className="project-card group">
              <div className="aspect-video bg-[#00f0ff]/5 rounded-3xl mb-6 relative overflow-hidden boarder border-[#00f0ff]/10 flex items-center justify-center">
                 <i className="fa-solid fa-newspaper text-6xl text-[#00f0ff]/20 group-hover:scale-110 transition-transform"></i>
              </div>
              <h3 className="text-2xl font-bold mb-3">ArunTech Blog</h3>
              <p className="text-gray-400 mb-6">A high-traffic tech blog with Google Sign-In, CMS, and AdSense integration.</p>
              <Link href="/blog" className="text-[#00f0ff] font-bold hover:underline">Read Blog &rarr;</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-6">Let's build something amazing.</h2>
           <p className="text-gray-400 mb-10">Have a project in mind or just want to chat tech? Reach out below.</p>
           <div className="flex justify-center gap-6">
              <a href="mailto:kcaarun10@gmail.com" className="text-2xl hover:text-[#00f0ff]"><i className="fa-solid fa-envelope"></i></a>
              <a href="https://wa.link/0mmt5c" className="text-2xl hover:text-green-500"><i className="fa-brands fa-whatsapp"></i></a>
           </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
         <p>&copy; {new Date().getFullYear()} Arun Regmi. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">Arun</Link>
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <a href="#home" className="hover:text-[#00f0ff] transition-colors">Home</a>
          <a href="#work" className="hover:text-[#00f0ff] transition-colors">Work</a>
          <Link href="/blog" className="px-4 py-2 bg-[#00f0ff]/10 text-[#00f0ff] rounded-lg hover:bg-[#00f0ff]/20 transition-all">Tech Blog</Link>
          <a href="#contact" className="hover:text-[#00f0ff] transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}
