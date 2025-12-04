import React, { useState, useEffect } from 'react';
import { Play, Music2, Youtube, ListMusic } from 'lucide-react';
import { dbGetPlaylists } from '../services/db';
import { Playlist } from '../types';

const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    setPlaylists(dbGetPlaylists());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Playlists</h1>
            <p className="text-gray-400">Curated collections from Spotify, YouTube, and the Melody View community.</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">All</button>
            <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-md text-sm font-medium hover:bg-white/10">Spotify</button>
            <button className="px-4 py-2 bg-white/5 text-gray-300 rounded-md text-sm font-medium hover:bg-white/10">YouTube</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="group bg-neutral-900 rounded-xl overflow-hidden hover:bg-neutral-800 transition-all duration-300 border border-white/5 hover:border-red-500/30">
            <div className="relative aspect-square">
                <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={48} className="text-white drop-shadow-lg" fill="currentColor" />
                </div>
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase text-white flex items-center gap-1">
                    {playlist.platform === 'spotify' && <Music2 size={12} className="text-green-500"/>}
                    {playlist.platform === 'youtube' && <Youtube size={12} className="text-red-500"/>}
                    {playlist.platform === 'mixed' && <ListMusic size={12} className="text-blue-400"/>}
                    {playlist.platform}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400 mb-3">By {playlist.creatorId === 'u1' ? 'You' : 'Unknown'}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>{playlist.songs.length} Songs</span>
                    <button className="hover:text-red-500 transition-colors">Save Library</button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
