import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { X, Maximize2, Minimize2, Music, ExternalLink } from 'lucide-react';

interface PlayerProps {
  currentSong: Song | null;
  onClose: () => void;
}

export const Player: React.FC<PlayerProps> = ({ currentSong, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset states when song changes
  useEffect(() => {
    setImgError(false);
    // Auto-expand for YouTube to ensure video is visible
    if (currentSong?.platform === 'youtube') {
        setIsExpanded(true);
    } else {
        setIsExpanded(false);
    }
  }, [currentSong]);

  if (!currentSong) return null;

  const isYoutube = currentSong.platform === 'youtube';
  const videoId = currentSong.uri || currentSong.id;
  const spotifyId = currentSong.uri?.split(':').pop() || currentSong.id;

  // YouTube Embed Strategy:
  // We strictly avoid passing 'origin' or 'widget_referrer' params here.
  // The Error 153 (embedder.identity.missing.referrer) occurs because the browser (Opera/Privacy tools)
  // strips the Referer header, but the URL params tell YouTube to verify the origin.
  // By removing the params and setting referrerPolicy="no-referrer", we stop the verification check.
  const getYoutubeSrc = (id: string) => {
    return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  };

  return (
    <>
      {/* THEATER MODE OVERLAY (For YouTube) */}
      {isExpanded && isYoutube && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
           
           {/* Header Controls */}
           <div className="absolute top-4 right-4 flex gap-4 z-50">
             <a 
                href={`https://www.youtube.com/watch?v=${videoId}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white/10 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors backdrop-blur-md flex items-center gap-2 text-sm font-bold"
             >
                <ExternalLink size={16} /> Watch on YouTube
             </a>
             <button 
                onClick={() => setIsExpanded(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md"
             >
                <Minimize2 size={24} />
             </button>
           </div>

           <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-red-900/50 relative">
              <iframe 
                key={videoId}
                width="100%" 
                height="100%" 
                src={getYoutubeSrc(videoId)} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full"
             ></iframe>
           </div>
           
           <div className="mt-6 text-center max-w-2xl">
             <h2 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h2>
             <p className="text-gray-400">{currentSong.artist}</p>
             <p className="text-gray-600 text-xs mt-4">
                If playback fails, the video owner may have disabled embedding.
             </p>
           </div>
        </div>
      )}

      {/* BOTTOM BAR PLAYER */}
      <div className={`fixed bottom-0 left-0 w-full z-[90] bg-black/95 border-t border-red-900/50 p-4 shadow-2xl transition-transform duration-300 ${isExpanded ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Song Info */}
          <div className="flex items-center gap-4 w-1/4 min-w-[150px]">
            <div className="w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden border border-white/10 relative">
                {!imgError ? (
                    <img 
                        src={currentSong.albumCover} 
                        alt={currentSong.title} 
                        className="w-full h-full object-cover" 
                        onError={() => setImgError(true)}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-neutral-800">
                        <Music size={20} />
                    </div>
                )}
            </div>
            <div className="hidden sm:block overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate">{currentSong.title}</h4>
              <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Player Embed */}
          <div className="flex-grow flex justify-center relative px-2">
              {isYoutube ? (
                   <div className="flex items-center gap-4 w-full max-w-md">
                       <div 
                         className="w-full h-[60px] rounded border border-white/5 bg-neutral-900 flex items-center justify-center text-gray-500 text-xs cursor-pointer hover:bg-neutral-800 transition-colors"
                         onClick={() => setIsExpanded(true)}
                       >
                           <span className="flex items-center gap-2"><Maximize2 size={12}/> Playing in Theater Mode</span>
                       </div>
                       
                       {/* Expand Button */}
                       <button 
                        onClick={() => setIsExpanded(true)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 flex-shrink-0"
                        title="Theater Mode"
                       >
                           <Maximize2 size={20} />
                       </button>
                   </div>
              ) : (
                  // Spotify Embed
                  <iframe 
                      key={spotifyId}
                      src={`https://open.spotify.com/embed/track/${spotifyId}`} 
                      width="100%" 
                      height="80" 
                      frameBorder="0" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      className="max-w-md h-[80px] rounded bg-black"
                  ></iframe>
              )}
          </div>

          {/* Close Button */}
          <div className="w-1/4 flex justify-end">
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
              </button>
          </div>
        </div>
      </div>
    </>
  );
};
