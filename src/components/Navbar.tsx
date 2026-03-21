import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/blog" className="text-2xl font-bold tracking-tighter">
              Arun<span className="text-primary-accent text-[#00f0ff]">Tech</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              <Link href="/" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Portfolio</Link>
              <Link href="/blog" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Privacy Policy</Link>
              <Link href="/categories/mobile" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium border-l border-gray-700 pl-4 transition-colors">Mobile</Link>
              <Link href="/categories/ai" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">AI</Link>
              <Link href="/categories/web-dev" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Web Dev</Link>
              <Link href="/categories/gadgets" className="hover:text-[#00f0ff] px-2 py-2 rounded-md text-sm font-medium transition-colors">Gadgets</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
