import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#050505] relative overflow-hidden text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00f0ff]/10 via-[#00f0ff]/0 to-transparent pointer-events-none blur-3xl rounded-full"></div>

            <div className="relative z-10 glass p-12 md:p-20 rounded-[40px] border border-white/10 shadow-2xl max-w-2xl w-full">
                <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    404
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white tracking-tight">
                    Oops! You've drifted into the <span className="text-[#00f0ff]">void</span>.
                </h2>
                <p className="text-gray-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/" className="px-10 py-4 bg-[#00f0ff] text-black font-black rounded-2xl hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
                        <i className="fa-solid fa-house"></i>
                        Return Home
                    </Link>
                    <Link href="/blog" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
                        <i className="fa-solid fa-newspaper"></i>
                        Read Articles
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-10 text-gray-600 text-sm font-mono tracking-widest uppercase">
                ArunTech Error Handler
            </div>
        </div>
    );
}
