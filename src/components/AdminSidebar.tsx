"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FaTachometerAlt, FaEdit, FaPlus, FaSignOutAlt } from 'react-icons/fa';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Create Post', href: '/admin/create', icon: <FaPlus /> },
  ];

  return (
    <aside className="w-64 glass h-screen fixed top-0 left-0 hidden md:flex flex-col border-r border-white/10 z-50">
      <div className="p-6 border-b border-white/10 flex items-center mb-6">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
          Arun<span className="text-[#00f0ff]">Tech</span> Admin
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.name} href={link.href} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-[#00f0ff]/20 text-[#00f0ff] font-semibold tracking-wide' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={() => signOut(auth)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
