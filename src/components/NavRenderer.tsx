"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * NavRenderer component handles the conditional display of the global 
 * Header/Footer. The Portfolio landing page (/) has its own custom 
 * navigation and footer to match your branding.
 */
export default function NavRenderer({ 
    children, 
    navbar, 
    footer 
}: { 
    children: React.ReactNode, 
    navbar: React.ReactNode, 
    footer: React.ReactNode 
}) {
  const pathname = usePathname();
  const isPortfolio = pathname === '/';
  
  // Don't show the global Blog Navbar/Footer on the Portfolio landing page
  if (isPortfolio) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
