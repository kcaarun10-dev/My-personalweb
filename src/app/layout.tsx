import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './prose.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdUnit from '@/components/AdUnit';
import Script from 'next/script';
import NavRenderer from '@/components/NavRenderer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArunTech - Modern Tech Blog',
  description: 'Welcome to ArunTech, your top source for Mobile, AI, Web Dev, and Gadgets.',
  openGraph: {
    title: 'ArunTech Tech Blog',
    description: 'Insights on Mobile, AI, Web Dev, and more.',
    url: 'https://arunregmi.com.np',
    siteName: 'ArunTech',
    images: [
      {
        url: 'https://arunregmi.com.np/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Script - Replace with real publisher ID */}
        <Script
          id="adsense-id"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-AIzaSyAh22GQ9-e4qgOY9CSG4gSApEBmL3e8kaE"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-gray-100 flex flex-col`}>
        <NavRenderer 
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {/* AdSlot 1: Global Header Leaderboard (728x90) */}
          <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
             <AdUnit slot="HEADER_AD_SLOT_ID" /> 
          </div>

          <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>

          {/* AdSlot 4: Global Footer Ad (728x90) */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5 pt-12">
             <AdUnit slot="FOOTER_AD_SLOT_ID" /> 
          </div>
        </NavRenderer>
      </body>
    </html>
  );
}
