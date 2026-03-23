"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PortfolioUI() {
  const [typedText, setTypedText] = useState("I'm a Web Developer");

  // Typing Effect
  useEffect(() => {
    const words = ["Web Developer", "UI/UX Designer", "Content Creator", "Tech Entrepreneur"];
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    let timeoutId: any;

    function type() {
      const currentWord = words[wordIndex];
      const typingSpeed = isDeleting ? 50 : 150;

      if (!isDeleting && letterIndex === currentWord.length) {
        // Pause at the end of word
        timeoutId = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2000);
        return;
      }

      if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        timeoutId = setTimeout(type, 500);
        return;
      }

      const nextText = isDeleting
        ? currentWord.substring(0, letterIndex - 1)
        : currentWord.substring(0, letterIndex + 1);

      setTypedText(`I'm a ${nextText}`);
      letterIndex = isDeleting ? letterIndex - 1 : letterIndex + 1;

      timeoutId = setTimeout(type, typingSpeed);
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
      <main>
        {/* Gallery / Hero */}
        <section className="home min-h-[90vh] flex items-center pt-20" id="home">
          <div className="home-content">
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <img src="/favicon.png" alt="ArunTech" className="h-8 w-8 object-contain" />
              <h1 className="text-[#00f0ff] font-extrabold uppercase tracking-[0.2em] text-sm">Arun Regmi</h1>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tighter">Building web experiences that <span className="text-[#00f0ff] italic">matter</span>.</h2>
            <h3 className="typing-text text-2xl md:text-4xl text-white/70 font-mono mb-10 h-12">{typedText}<span className="animate-pulse">|</span></h3>
            <p className="max-w-xl text-lg text-gray-400 mb-12 leading-relaxed opacity-80 font-medium">I design and develop fast, modern, and accessible websites and useful online tools. I focus on performance, simplicity, and delightful UX.</p>
            <div className="flex gap-6 flex-wrap">
              <a href="#contact" className="px-10 py-4 bg-[#00f0ff] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-105 transition-all">Hire Me Now</a>
              <Link href="/blog" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all">Explore Articles</Link>
            </div>
          </div>
          <div className="home-img mt-12 md:mt-0 flex-shrink-0">
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-[40px] overflow-hidden glass border border-white/10 shadow-3xl transform rotate-3 hover:rotate-0 transition-all duration-700">
              <img src="/main.jpg" alt="Arun Regmi" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100" />
            </div>
          </div>
        </section>

        {/* Selected Work */}
        <section id="work" className="py-40">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">Selected <span className="text-[#00f0ff]">Work</span></h2>
              <p className="text-gray-500">A showcase of technical depth and modern web engineering.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-16">
            <div className="project-card group max-w-4xl mx-auto w-full">
              <div className="aspect-video bg-[#00f0ff]/10 rounded-[40px] mb-8 relative overflow-hidden border border-[#00f0ff]/30 flex items-center justify-center p-12 transition-all duration-500 group-hover:border-[#00f0ff]/60 group-hover:bg-[#00f0ff]/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00f0ff]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <i className="fa-solid fa-newspaper text-9xl md:text-[13rem] text-[#00f0ff] opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 drop-shadow-[0_0_50px_rgba(0,240,255,0.6)]"></i>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-6 tracking-tight">ArunTech Blog & Media</h3>
                <p className="text-gray-400 mb-10 leading-relaxed text-xl max-w-2xl mx-auto">A full-featured tech media platform built with Next.js and Firebase. Optimized for Core Web Vitals with seamless AdSense integration and high-performance rendering.</p>
                <Link href="/blog" className="inline-flex items-center px-12 py-5 bg-[#00f0ff] text-black rounded-2xl font-black hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105 transition-all">Explore Articles &rarr;</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Section */}
      <section id="contact" className="py-32 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Let's build something <span className="text-[#00f0ff]">amazing</span>.</h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">Have a project in mind or just want to chat tech? I'm always open to new opportunities and collaborations.</p>
          <div className="flex justify-center gap-10">
            <a href="mailto:kcaarun10@gmail.com" className="text-4xl hover:text-[#00f0ff] hover:scale-125 transition-all"><i className="fa-solid fa-envelope"></i></a>
            <a href="https://wa.me/9779810975653" className="text-4xl hover:text-green-500 hover:scale-125 transition-all"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="https://instagram.com/regmi.rays10" className="text-4xl hover:text-pink-500 hover:scale-125 transition-all"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </section>
    </div>
  );
}
