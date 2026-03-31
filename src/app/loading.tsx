"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-[#00f0ff]/10 rounded-full"></div>
        {/* Spinning Progress */}
        <div className="absolute inset-0 border-4 border-t-[#00f0ff] rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
        {/* Inner Static Glow */}
        <div className="absolute inset-4 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full animate-pulse-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-[#00f0ff] uppercase tracking-tighter animate-pulse">ArunTech</span>
        </div>
      </div>
    </div>
  );
}
