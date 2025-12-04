import React, { useState, useEffect } from 'react';
import { Play, Music2, Youtube, ListMusic, X, Clock, Filter } from 'lucide-react';
import { dbGetPlaylists } from '../services/db';
import { Playlist, Song } from '../types';

const Playlists: React.FC = () => {
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [filter, setFilter] = useState<'all' | 'spotify' | 'youtube'>('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    // Load playlists from DB
    const playlists = dbGetPlaylists();
    setAllPlaylists(playlists);
    // Initial filter application
    applyFilter(playlists, filter);
  }, []);

  useEffect(() => {
    applyFilter(allPlaylists, filter);
  }, [filter, allPlaylists]);

  const applyFilter = (playlists: Playlist[], currentFilter: string) => {
    if (currentFilter === 'all') {
      setFilteredPlaylists(playlists);
    } else {
      setFilteredPlaylists(playlists.filter(p => p.platform === currentFilter || p.platform === 'mixed'));
    }
  };

  const handlePlaySong = (song: Song) => {
    if (window.playSong) {
      window.playSong(song);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length > 0) {
      handlePlaySong(playlist.songs[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Playlists</h1>
            <p className="text-gray-400">Curated collections from Spotify, YouTube, and the Melody View community.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0 bg-neutral-900 p-1 rounded-lg border border-white/5">
            <div className="px-3 py-2 text-gray-500">
                <Filter size={16} />
            </div>
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('spotify')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'spotify' ? 'bg-[#1DB954] text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Spotify
            </button>
            <button 
              onClick={() => setFilter('youtube')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'youtube' ? 'bg-[#FF0000] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              YouTube
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPlaylists.map((playlist) => (
          <button 
            key={playlist.id} 
            onClick={() => setSelectedPlaylist(playlist)}
            className="group bg-neutral-900 rounded-xl overflow-hidden hover:bg-neutral-800 transition-all duration-300 border border-white/5 hover:border-red-500/30 text-left w-full shadow-lg"
          >
            <div className="relative aspect-square bg-gray-800">
                <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop';
                    }}
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-600 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={32} className="text-white fill-current" />
                    </div>
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
                <p className="text-sm text-gray-400 mb-3">By {playlist.creatorId === 'u1' ? 'You' : 'Curator'}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium border-t border-white/5 pt-3">
                    <span>{playlist.songs.length} Songs</span>
                    <span className="group-hover:text-red-500 transition-colors">View Details</span>
                </div>
            </div>
          </button>
        ))}
      </div>
      
      {filteredPlaylists.length === 0 && (
          <div className="text-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <ListMusic size={64} className="mx-auto mb-4 text-gray-600"/>
              <h3 className="text-xl font-bold text-white mb-2">No Playlists Found</h3>
              <p className="text-gray-400">Try adjusting your filters or create a new playlist in your profile.</p>
          </div>
      )}

      {/* Playlist Details Modal */}
      {selectedPlaylist && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-neutral-900 w-full max-w-4xl h-[80vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden relative shadow-2xl">
              <button 
                  onClick={() => setSelectedPlaylist(null)} 
                  className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-red-600 transition-colors backdrop-blur-md"
              >
                  <X size={24} />
              </button>

              <div className="h-60 relative flex-shrink-0">
                  <img src={selectedPlaylist.coverUrl} className="w-full h-full object-cover opacity-50" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
                      <img 
                        src={selectedPlaylist.coverUrl} 
                        className="w-32 h-32 rounded-lg shadow-2xl border-2 border-white/10 hidden sm:block object-cover" 
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Playlist</span>
                             {selectedPlaylist.platform !== 'mixed' && (
                                <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{selectedPlaylist.platform}</span>
                             )}
                          </div>
                          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 shadow-black drop-shadow-lg">{selectedPlaylist.name}</h2>
                          <div className="flex items-center gap-4">
                             <button 
                                onClick={() => handlePlayPlaylist(selectedPlaylist)}
                                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-xl"
                             >
                                 <Play size={20} fill="currentColor" /> Play All
                             </button>
                             <span className="text-gray-300 text-sm font-medium">{selectedPlaylist.songs.length} Songs</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="flex-grow overflow-y-auto p-6 bg-neutral-900">
                  <div className="space-y-1">
                      {selectedPlaylist.songs.map((song, idx) => (
                          <div 
                            key={`${song.id}-${idx}`} 
                            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                            onClick={() => handlePlaySong(song)}
                          >
                              <div className="w-8 text-center text-gray-500 font-mono text-sm group-hover:text-white">
                                  <span className="group-hover:hidden">{idx + 1}</span>
                                  <Play size={14} className="hidden group-hover:inline mx-auto text-white fill-current"/>
                              </div>
                              <img src={song.albumCover} className="w-10 h-10 rounded object-cover" alt="" referrerPolicy="no-referrer" />
                              <div className="flex-grow min-w-0">
                                  <p className="text-white font-bold truncate group-hover:text-red-500 transition-colors">{song.title}</p>
                                  <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                              </div>
                              <div className="text-gray-500 text-xs flex items-center gap-4">
                                  <span className="hidden sm:flex items-center gap-1"><Clock size={12}/> {song.duration}</span>
                                  {song.platform === 'spotify' ? <Music2 size={16} className="text-green-500"/> : <Youtube size={16} className="text-red-500"/>}
                              </div>
                          </div>
                      ))}
                      {selectedPlaylist.songs.length === 0 && (
                          <div className="text-center text-gray-500 py-10">
                              <Music2 size={32} className="mx-auto mb-2 opacity-50"/>
                              <p>No songs in this playlist.</p>
                          </div>
                      )}
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;