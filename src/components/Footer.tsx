import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full glass border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex justify-center flex-col items-center md:items-start md:order-2">
            <div className="flex space-x-6 mb-4">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition">Contact</Link>
              <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition">Privacy Policy</Link>
            </div>
            <span className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} ArunTech. All rights reserved.</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ArunTech Logo" className="h-8 md:h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-all" />
              <span className="ml-3 text-lg font-bold tracking-tighter text-gray-400">ArunTech Blog & Media</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
