import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, PlayCircle, Users } from 'lucide-react';
import { FEATURED_SONGS } from '../constants';
import { SongCard } from '../components/SongCard';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-red-500 to-white animate-pulse">
            Your Music.<br/> Your World.
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect your Spotify and YouTube worlds in one place. Discover daily picks, create ultimate mixed playlists, and share with a community that listens.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Start Listening <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-full transition-all flex items-center justify-center">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                    <Search className="text-red-500 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-3">Unified Search</h3>
                    <p className="text-gray-400">Search across Spotify and YouTube simultaneously. Find covers, originals, and remixes in one go.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                    <PlayCircle className="text-red-500 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-3">Smart Playlists</h3>
                    <p className="text-gray-400">Build playlists that defy platforms. Mix a YouTube video with a Spotify track seamlessly.</p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                    <Users className="text-red-500 mb-4" size={40} />
                    <h3 className="text-2xl font-bold mb-3">Community</h3>
                    <p className="text-gray-400">Rate songs, write reviews, and see what the Melody View community is jamming to today.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Songs */}
      <section className="py-20 bg-gradient-to-b from-black to-red-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Tracks</h2>
                <p className="text-gray-400">Hand-picked selections trending on Melody View.</p>
            </div>
            <Link to="/playlists" className="text-red-500 hover:text-red-400 font-medium flex items-center gap-1">
                View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {FEATURED_SONGS.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
            {/* Duplicate for visual balance */}
             <SongCard song={{...FEATURED_SONGS[0], id: 's4', title: 'Starboy', artist: 'The Weeknd'}} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;