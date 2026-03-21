import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | ArunTech',
  description: 'Learn more about ArunTech, your ultimate source for the latest tech news, smartphone leaks, and gadget reviews.',
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00f0ff]">About ArunTech</h1>
      <div className="prose prose-invert prose-lg max-w-none">
        <p>
          Welcome to ArunTech, your number one source for all things technology. We're dedicated to providing you the very best of smartphone leaks, tech news, reviews, and comparisons, with an emphasis on accuracy, speed, and deep analysis.
        </p>
        <p>
          Founded by technology enthusiasts, ArunTech has come a long way from its beginnings. When we first started out, our passion for breaking the latest Xiaomi and iPhone news drove us to start our own business so that ArunTech can offer you the world's most advanced tech insights.
        </p>
        <h2>The Author Behind ArunTech</h2>
        <div className="flex flex-col md:flex-row items-center gap-8 my-8 border-y border-white/10 py-8">
           <div className="w-24 h-24 rounded-full bg-[#00f0ff]/20 flex items-center justify-center text-3xl font-bold text-[#00f0ff] shrink-0">
             AR
           </div>
           <div>
             <h3 className="text-xl font-bold mb-2">Arun Regmi (kcaarun10-dev)</h3>
             <p className="text-gray-400 m-0">
               Arun is a tech enthusiast, developer, and content creator dedicated to simplifying complex tech leaks and news for the Nepali and global audience.
             </p>
           </div>
        </div>

        <h2>Join the Community</h2>
        <p>
          Beyond writing, I create high-quality technical videos and reviews on my **Vlog Channel**. Stay updated with the latest unboxings, deep-dives into smartphone leaks, and tech tutorials.
        </p>
        
        <div className="glass p-6 rounded-2xl border border-red-500/20 text-center flex flex-col items-center space-y-4 my-8">
           <div className="text-red-500 text-3xl font-bold">YouTube Vlog Channel</div>
           <p className="max-w-md text-gray-400">Join our growing community and never miss a leak again! Click below to subscribe.</p>
           <a 
              href="https://youtube.com/@kcaarun10" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              Visit YouTube Channel &rarr;
            </a>
        </div>

        <h2>Our Mission</h2>
        <p>
          To empower readers with the knowledge they need to make informed decisions about their gadgets and stay ahead in the fast-paced world of technology.
        </p>
      </div>
    </div>
  );
}
