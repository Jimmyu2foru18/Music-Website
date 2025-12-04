import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Melody View</h1>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-red-500 mb-4">What We Offer</h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></span>
                <p><strong className="text-white">Unified Access:</strong> Access to millions of songs from Spotify and YouTube in a single interface.</p>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></span>
                <p><strong className="text-white">Playlist Mastery:</strong> Easy playlist creation and management without platform boundaries.</p>
              </li>
               <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></span>
                <p><strong className="text-white">Personalized Identity:</strong> Personalized profiles with custom avatars, bios, and username management.</p>
              </li>
               <li className="flex items-start">
                <span className="w-2 h-2 mt-2 mr-3 bg-red-500 rounded-full"></span>
                <p><strong className="text-white">Discovery:</strong> Advanced search tools and a daily "Song of the Day" recommendation engine.</p>
              </li>
            </ul>
          </section>

          {/* How it works */}
          <section className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-red-500 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 font-bold text-xl mx-auto mb-4">1</div>
                    <h3 className="font-bold text-white mb-2">Create Account</h3>
                    <p className="text-sm text-gray-400">Sign up securely to start building your profile and library.</p>
                </div>
                 <div className="text-center">
                    <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 font-bold text-xl mx-auto mb-4">2</div>
                    <h3 className="font-bold text-white mb-2">Search & Save</h3>
                    <p className="text-sm text-gray-400">Use our API-powered search to find tracks and add them to your lists.</p>
                </div>
                 <div className="text-center">
                    <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 font-bold text-xl mx-auto mb-4">3</div>
                    <h3 className="font-bold text-white mb-2">Engage</h3>
                    <p className="text-sm text-gray-400">Write reviews, rate songs, and check the daily top picks.</p>
                </div>
            </div>
          </section>

          <section className="text-center pt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to listen?</h3>
            <p className="text-gray-400 mb-8">Join Melody View today and transform how you experience music.</p>
             <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-900/20">
                Join Now <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;