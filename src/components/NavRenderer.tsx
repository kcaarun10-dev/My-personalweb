"use client";

import { usePathname } from 'next/navigation';

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
  // We no longer hide nav on portfolio since we unified the Navbar

  return (
    <>
      {navbar}
      {children}
      {footer}
    </>
  );
}
