import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Menu, X, User, LogIn, Home, ListMusic, Calendar, Star, Info, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Player } from './Player';
import { Song } from '../types';
import { handleSpotifyCallback } from '../services/api';

declare global {
  interface Window {
    playSong: (song: Song) => void;
  }
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle Spotify Callback
  useEffect(() => {
    const wasCallback = handleSpotifyCallback();
    if (wasCallback) {
        // If we processed a token, clear the hash and force a clean URL state
        navigate('/profile');
    }
  }, [navigate]);

  React.useEffect(() => {
    window.playSong = (song: Song) => {
        setCurrentSong(song);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home size={16} /> },
    { path: '/playlists', label: 'Playlists', icon: <ListMusic size={16} /> },
    { path: '/song-of-the-day', label: 'Daily Pick', icon: <Calendar size={16} /> },
    { path: '/reviews', label: 'Reviews', icon: <Star size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-900 selection:text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all duration-300">
        {/* Increased max-width for better spacing on large screens */}
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center gap-4 group">
                <div className="p-2.5 bg-gradient-to-br from-red-600 to-red-900 rounded-xl shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform duration-300">
                    <Music className="text-white" size={26} />
                </div>
                <div className="hidden md:block">
                    <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    MELODY VIEW
                    </span>
                </div>
                </Link>
            </div>

            {/* Desktop Nav - Centered & Spacious */}
            <nav className="hidden xl:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest transition-all duration-300 py-2 border-b-2 ${
                    isActive(link.path) 
                      ? 'text-red-500 border-red-500' 
                      : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="opacity-70">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                  to="/about"
                  className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest transition-all duration-300 py-2 border-b-2 ${
                    isActive('/about') ? 'text-red-500 border-red-500' : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="opacity-70"><Info size={16} /></span>
                  <span>About</span>
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest transition-all duration-300 py-2 border-b-2 ${
                    isActive('/admin') ? 'text-red-500 border-red-500' : 'text-red-900/80 border-transparent hover:text-red-500'
                  }`}
                >
                  <span className="opacity-70"><ShieldCheck size={16} /></span>
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
                
                {/* Search Bar - Wider and Animated */}
                <form onSubmit={handleSearch} className="hidden lg:block relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-500 group-focus-within:text-red-500 transition-colors"/>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search songs, artists..." 
                        className="block w-64 focus:w-80 pl-11 pr-4 py-2.5 border border-white/10 rounded-full bg-white/5 text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm font-medium transition-all duration-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                {/* User Actions */}
                <div className="hidden md:flex items-center">
                {user ? (
                    <Link to="/profile" className="flex items-center gap-3 pl-6 border-l border-white/10 group">
                        <div className="text-right hidden xl:block">
                            <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">{user.username}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user.role}</p>
                        </div>
                        <div className="relative">
                            <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full border-2 border-white/10 group-hover:border-red-500 transition-colors object-cover"/>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                        <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            LOG IN
                        </Link>
                        <Link to="/register" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-red-900/20 hover:scale-105">
                            SIGN UP
                        </Link>
                    </div>
                )}
                </div>

                {/* Mobile Menu Button */}
                <div className="xl:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-300 hover:text-white focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-neutral-900 border-b border-white/10 absolute w-full shadow-2xl">
            <div className="px-6 pt-6 pb-8 space-y-4">
              <form onSubmit={handleSearch} className="mb-8 relative">
                 <Search size={18} className="absolute left-4 top-3.5 text-gray-500"/>
                 <input 
                    type="text" 
                    placeholder="Search songs..." 
                    className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl bg-black text-white focus:border-red-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                    <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold uppercase tracking-wider ${
                        isActive(link.path)
                        ? 'bg-red-900/20 text-red-500'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                    >
                    {link.icon}
                    <span>{link.label}</span>
                    </Link>
                ))}
                <Link
                    to="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold uppercase tracking-wider text-gray-400 hover:bg-white/5 hover:text-white"
                    >
                    <Info size={16} />
                    <span>About</span>
                </Link>
                {user?.role === 'admin' && (
                    <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-xl text-base font-bold uppercase tracking-wider text-red-400 hover:bg-red-900/20"
                    >
                    <ShieldCheck size={16} />
                    <span>Admin</span>
                    </Link>
                )}
              </div>

              <div className="border-t border-white/10 mt-6 pt-6">
                 {user ? (
                    <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-bold text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                    <img src={user.avatarUrl} className="w-8 h-8 rounded-full"/>
                    <span>My Profile</span>
                    </Link>
                 ) : (
                    <div className="space-y-4">
                        <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-gray-300 hover:bg-white/5 hover:text-white border border-white/10"
                        >
                        LOG IN
                        </Link>
                         <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold bg-red-600 text-white"
                        >
                        SIGN UP FREE
                        </Link>
                    </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 relative">
        {/* Ambient Gradient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-black"></div>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-red-900/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-12 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Music className="text-red-600" size={24} />
                <span className="text-xl font-bold text-white">Melody View</span>
              </Link>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                The ultimate platform for music discovery. Connect Spotify & YouTube. Create mixed playlists. Join the conversation.
              </p>
            </div>
            {/* ... rest of footer remains same ... */}
             <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><Link to="/playlists" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Playlists</Link></li>
                <li><Link to="/reviews" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Community Reviews</Link></li>
                <li><Link to="/about" className="text-gray-500 hover:text-red-500 text-sm transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-red-500 text-sm transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Melody View. Built for music lovers.
            </p>
          </div>
        </div>
      </footer>

      <Player currentSong={currentSong} onClose={() => setCurrentSong(null)} />
    </div>
  );
};