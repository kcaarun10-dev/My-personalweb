import { Metadata } from 'next';
import PortfolioUI from '@/components/PortfolioUI';

/**
 * PORTFOLIO METADATA (Home Page /)
 * Optimized to appear when searching for 'Arun Regmi', 'Web Developer Nepal', 
 * or 'Frontend Developer Portfolio'.
 */
export const metadata: Metadata = {
  title: 'Arun Regmi — Web Developer & Content Creator',
  description: 'Building fast, modern, and accessible web experiences. Expert in Next.js, Firebase, and UI/UX design. Founder of ArunTech.',
  keywords: ['Arun Regmi', 'Web Developer', 'Portfolio', 'Frontend Developer', 'Nepal', 'Next.js Expert', 'Firebase Expert'],
  alternates: {
    canonical: 'https://arunregmi.com.np',
  },
  openGraph: {
    title: 'Arun Regmi — Web Developer',
    description: 'Expert Web Development and Tech Insights.',
    images: ['/main.jpg'],
    url: 'https://arunregmi.com.np',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arun Regmi — Portfolio',
    description: 'Developer & Tech Blogger.',
    images: ['/main.jpg'],
  }
};

export default function Home() {
  return <PortfolioUI />;
}
