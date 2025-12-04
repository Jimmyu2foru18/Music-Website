import React, { useState, useEffect } from 'react';
import { Play, Youtube, Mic2, Plus, Music } from 'lucide-react';
import { Song } from '../types';
import { PlaylistSelector } from './PlaylistSelector';

interface SongCardProps {
  song: Song;
  featured?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ song, featured = false }) => {
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Reset error state if the song changes (e.g. reused component in a list)
  useEffect(() => {
    setImgError(false);
  }, [song.albumCover]);

  const handlePlay = () => {
    if (window.playSong) {
      window.playSong(song);
    }
  };

  return (
    <>
      <div className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}>
        <div className="aspect-square w-full relative overflow-hidden bg-neutral-900">
          {!imgError && song.albumCover ? (
              <img 
                src={song.albumCover} 
                alt={song.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
              />
          ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-neutral-800">
                  <Music size={48} />
              </div>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
            <button 
              onClick={handlePlay}
              className="p-4 rounded-full bg-red-600 text-white transform scale-90 group-hover:scale-100 transition-transform shadow-lg hover:bg-red-700"
            >
              <Play size={32} fill="currentColor" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowPlaylistModal(true); }}
              className="p-3 rounded-full bg-white/20 text-white transform scale-90 group-hover:scale-100 transition-transform hover:bg-white/30 backdrop-blur-md"
              title="Add to Playlist"
            >
              <Plus size={24} />
            </button>
          </div>
          <div className="absolute top-2 right-2">
             {song.platform === 'spotify' ? (
               <div className="bg-[#1DB954] p-1.5 rounded-full text-black">
                  <Mic2 size={16} /> 
               </div>
             ) : (
               <div className="bg-[#FF0000] p-1.5 rounded-full text-white">
                  <Youtube size={16} />
               </div>
             )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white truncate text-lg group-hover:text-red-500 transition-colors">{song.title}</h3>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{song.duration}</span>
              <span className="capitalize">{song.platform}</span>
          </div>
        </div>
      </div>

      {showPlaylistModal && (
        <PlaylistSelector song={song} onClose={() => setShowPlaylistModal(false)} />
      )}
    </>
  );
};