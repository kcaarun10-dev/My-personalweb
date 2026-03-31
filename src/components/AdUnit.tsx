"use client";

import { useEffect } from 'react';
import Script from 'next/script';

type AdFormat = 'PopunderBest' | 'Native Banner' | 'Banner' | 'Smartlink' | 'Social Bar' | 'auto' | 'fluid' | 'rectangle' | 'CPM-Banner';

type AdUnitProps = {
  slot?: string;
  format?: AdFormat;
  className?: string;
  style?: React.CSSProperties;
  link?: string; // For Smartlink
};

/**
 * Universal AdUnit component.
 * Supports standard AdSense (auto, fluid) and High-Yield networks 
 * like Adsterra/PropellerAds (Popunder, Social Bar, etc.)
 */
export default function AdUnit({ slot = '', format = 'auto', className = '', style, link = '#' }: AdUnitProps) {
  useEffect(() => {
    // Only attempt to push AdSense scripts if in production
    if (process.env.NODE_ENV === 'development') return;

    // Logic for Standard Responsive Banner Ads (AdSense style)
    if (['auto', 'fluid', 'rectangle', 'Banner', 'Native Banner'].includes(format)) {
      const pushAd = () => {
        try {
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({});
        } catch (e: any) {
          if (e.message && !e.message.includes('already have ads')) {
            console.error('AdSense push error:', e);
          }
        }
      };
      const timeout = setTimeout(pushAd, 200);
      return () => clearTimeout(timeout);
    }

    // Logic for High-Yield Script Injections (Social Bar / Popunder)
    if (format === 'PopunderBest' || format === 'Social Bar') {
      if (slot) {
        const script = document.createElement('script');
        script.src = `https://pl28954132.profitablecpmratenetwork.com/${slot}/invoke.js`;
        script.async = true;
        script.dataset.cfasync = "false";
        document.body.appendChild(script);
      }
    }
  }, [slot, format]);

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    return (
      <div className={`my-8 bg-white/5 border border-dashed border-[#00f0ff]/30 rounded-xl flex flex-col items-center justify-center p-6 min-h-[120px] overflow-hidden ${className}`}>
        <p className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest mb-1">{format} Placeholder</p>
        <p className="text-[10px] text-gray-500 font-mono mb-2">Slot: {slot || 'External Script ID'}</p>
        {link !== '#' && <p className="text-[10px] text-blue-400 underline break-all max-w-xs text-center">{link}</p>}
        <div className="mt-3 px-3 py-1 bg-[#00f0ff]/10 text-[#00f0ff] text-[9px] rounded-md font-bold">MONETIZATION ACTIVE</div>
      </div>
    );
  }

  // 1. SMARTLINK Implementation (Direct Link Wrapper)
  if (format === 'Smartlink') {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={`block w-full py-5 px-6 bg-gradient-to-r from-[#00f0ff]/20 to-blue-600/20 border border-[#00f0ff]/50 rounded-2xl text-center text-white font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all ${className}`}>
        🚀 SPECIAL OFFER: View Recommended Content &rarr;
      </a>
    );
  }

  // 2. SOCIAL BAR / POPUNDER / CPM-Banner
  if (format === 'PopunderBest' || format === 'Social Bar' || format === 'CPM-Banner') {
    if (format === 'CPM-Banner') {
      return (
        <div className={`my-8 flex justify-center ${className}`}>
          <Script
            src={`https://pl28954132.profitablecpmratenetwork.com/${slot}/invoke.js`}
            async
            data-cfasync="false"
          />
          <div id={`container-${slot}`}></div>
        </div>
      );
    }
    return <div id={`ad-${format.replace(' ', '-')}-${slot}`} className="hidden opacity-0 invisible h-0 w-0" />;
  }

  // 3. STANDARD BANNERS (AdSense/Direct)
  return (
    <div className={`my-8 overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format={format === 'Banner' ? 'rectangle' : (format === 'Native Banner' ? 'fluid' : format)}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
