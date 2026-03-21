import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | ArunTech',
  description: 'Get in touch with ArunTech for business inquiries, reviews, or feedback.',
};

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00f0ff]">Contact Us</h1>
      <p className="text-gray-300 mb-8 border-b border-gray-800 pb-8">
        We would love to hear from you! Whether you have a question about our reviews, want to submit a smartphone leak, or just want to say hi.
      </p>
      
      <form className="max-w-2xl mx-auto glass p-8 rounded-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
          <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00f0ff]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00f0ff]" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
          <textarea rows={5} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00f0ff]" required></textarea>
        </div>
        <button type="submit" className="w-full bg-[#00f0ff] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
