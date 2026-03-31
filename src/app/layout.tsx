import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './prose.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdUnit from '@/components/AdUnit';
import Script from 'next/script';
import NavRenderer from '@/components/NavRenderer';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arun Regmi | Full-Stack Web Developer & Tech Creator',
  description: 'Welcome to ArunTech! Portfolio and tech blog of Arun Regmi. Specializing in modern web development, React, Next.js, AI, and mobile technology insights.',
  keywords: ['Arun Regmi', 'ArunTech', 'Web Developer Nepal', 'Full Stack Developer', 'React Developer', 'Next.js Expert', 'Tech Blog', 'Mobile Reviews', 'AI Engineering'],
  authors: [{ name: 'Arun Regmi', url: 'https://arunregmi.com.np' }],
  creator: 'Arun Regmi',
  publisher: 'ArunTech Media',
  metadataBase: new URL('https://arunregmi.com.np'),
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'ArunTech',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: 'Arun Regmi | Web Developer & Tech Creator',
    description: 'Portfolio and tech blog of Arun Regmi. Deep dives into Web Dev, AI, and Tech.',
    url: 'https://arunregmi.com.np',
    siteName: 'ArunTech',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arun Regmi Portfolio & Tech Blog'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#00f0ff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Google AdSense Script - Placeholder for real publisher ID */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossOrigin="anonymous"
        ></script>
        {/* Favicon / Branding */}
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* FontAwesome for Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Sitelinks Searchbox Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://arunregmi.com.np",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://arunregmi.com.np/blog?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-gray-100 flex flex-col`}>
        <NextTopLoader color="#00f0ff" showSpinner={false} />
        <NavRenderer
          navbar={<Navbar />}
          footer={<Footer />}
        >
          {/* AdSlot 1: Global Header Leaderboard (728x90) */}
          <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <AdUnit format="CPM-Banner" slot="d0422be77d40115e69689a2427797763" />
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
