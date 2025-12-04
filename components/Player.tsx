import React from 'react';
import { Song } from '../types';
import { X } from 'lucide-react';

interface PlayerProps {
  currentSong: Song | null;
  onClose: () => void;
}

export const Player: React.FC<PlayerProps> = ({ currentSong, onClose }) => {
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-black/95 border-t border-red-900/50 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Song Info */}
        <div className="flex items-center gap-4 w-1/4">
          <img src={currentSong.albumCover} alt={currentSong.title} className="w-12 h-12 rounded object-cover" />
          <div className="hidden sm:block">
            <h4 className="text-white font-bold text-sm truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player Controls / Embed */}
        <div className="flex-grow flex justify-center">
            {currentSong.platform === 'youtube' ? (
                 <iframe 
                    width="100%" 
                    height="80" 
                    src={`https://www.youtube.com/embed/${currentSong.uri || currentSong.id}?autoplay=1&controls=0`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    className="max-w-md h-[50px] rounded"
                 ></iframe>
            ) : (
                // Spotify Embed (Requires login in browser usually, or preview)
                <iframe 
                    src={`https://open.spotify.com/embed/track/${currentSong.uri?.split(':').pop() || '4cOdK2wGLETKBW3PvgPWqT'}`} 
                    width="100%" 
                    height="80" 
                    frameBorder="0" 
                    allow="encrypted-media"
                    className="max-w-md h-[80px] rounded"
                ></iframe>
            )}
        </div>

        {/* Close Button */}
        <div className="w-1/4 flex justify-end">
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                <X size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};
