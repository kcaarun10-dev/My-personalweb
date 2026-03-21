"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import './portfolio.css';
import './tools.css';

export default function ToolsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="portfolio-wrapper">
      <header>
        <Link href="/" className="logo">Arun</Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/tools" className="active">Tools</Link>
        </nav>
      </header>

      <section id="tools" className="py-20 min-h-screen">
        <div className="tools-container max-w-7xl mx-auto px-4">
          <h1 className="text-center text-4xl font-bold mb-4 mt-20"><span>Online Tools</span></h1>
          <p className="tools-description text-center text-gray-400 mb-12">A collection of simple and useful tools to help you with your daily tasks.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Word Counter */}
             <ToolCard icon="fa-calculator" title="Word Counter">
                <textarea id="countText" placeholder="Enter text to count..." className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm min-h-[100px] mb-4"></textarea>
                <div id="countOutput" className="text-sm text-gray-400">
                    <p>Words: <span id="wordCount">0</span></p>
                </div>
             </ToolCard>

             {/* Password Generator */}
             <ToolCard icon="fa-key" title="Password Generator">
                <button className="btn w-full mb-4">Generate Secure Password</button>
                <div id="passwordOutput" className="text-center font-mono text-[#00f0ff]"></div>
             </ToolCard>

             {/* Case Converter */}
             <ToolCard icon="fa-font" title="Case Converter">
                <textarea id="caseInput" placeholder="text to convert..." className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm min-h-[100px] mb-4"></textarea>
                <div className="flex gap-2">
                   <button className="btn flex-1 text-xs">UPPERCASE</button>
                   <button className="btn flex-1 text-xs">lowercase</button>
                </div>
             </ToolCard>

             {/* QR Placeholder */}
             <ToolCard icon="fa-qrcode" title="QR Generator">
                 <input type="text" placeholder="Enter URL..." className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm mb-4" />
                 <button className="btn w-full">Generate QR</button>
             </ToolCard>
          </div>
          
          <div className="text-center mt-12 pb-20">
             <p className="text-gray-500 italic">Merging more tools from original portfolio... visit /blog for tech reviews.</p>
          </div>
        </div>
      </section>

      <footer className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Arun Regmi. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function ToolCard({ icon, title, children }: { icon: string, title: string, children: React.ReactNode }) {
  return (
    <div className="tool-card glass p-6 rounded-2xl border border-white/10 hover:border-[#00f0ff]/50 transition-all">
      <div className="tool-card-header flex items-center space-x-3 mb-6">
        <i className={`fa-solid ${icon} text-2xl text-[#00f0ff]`}></i>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <div className="tool-card-body">
        {children}
      </div>
    </div>
  );
}
