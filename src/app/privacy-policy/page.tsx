import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ArunTech',
  description: 'Privacy Policy and data regulations for ArunTech visitors and AdSense network compliance.',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00f0ff]">Privacy Policy</h1>
      <div className="prose prose-invert prose-lg max-w-none">
        <p>At ArunTech, accessible from arunregmi.com.np, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ArunTech and how we use it.</p>
        
        <h2>Log Files</h2>
        <p>ArunTech follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
        
        <h2>Cookies and Web Beacons</h2>
        <p>Like any other website, ArunTech uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
        
        <h2>Google DoubleClick DART Cookie</h2>
        <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – https://policies.google.com/technologies/ads</p>
        
        <h2>Advertising Partners Privacy Policies</h2>
        <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ArunTech, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
      </div>
    </div>
  );
}
