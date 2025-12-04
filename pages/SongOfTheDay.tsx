import React, { useEffect, useState } from 'react';
import { Play, Calendar, Clock } from 'lucide-react';
import { dbGetSongOfTheDay } from '../services/db';
import { DayPick } from '../types';

const SongOfTheDay: React.FC = () => {
  const [data, setData] = useState<{today: DayPick | null, history: DayPick[]}>({ today: null, history: [] });

  useEffect(() => {
    const result = dbGetSongOfTheDay();
    setData(result);
  }, []);

  const handlePlay = (song: any) => {
    if (window.playSong) window.playSong(song);
  };

  if (!data.today) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Song of the Day</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Every day we select a track that defines the vibe. Randomly curated, logically sorted.
        </p>
      </div>

      {/* Hero Card for Today */}
      <div className="mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-900 to-black border border-red-500/20 shadow-2xl shadow-red-900/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
           <div className="relative group w-64 h-64 flex-shrink-0">
              <img 
                src={data.today.song.albumCover} 
                alt={data.today.song.title} 
                className="w-full h-full object-cover rounded-xl shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                 <button onClick={() => handlePlay(data.today?.song)}>
                    <Play size={48} className="text-white fill-current" />
                 </button>
               </div>
           </div>
           
           <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-4">
                 <Calendar size={12} /> {data.today.date}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{data.today.song.title}</h2>
              <p className="text-2xl text-gray-300 mb-6">{data.today.song.artist}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => handlePlay(data.today?.song)}
                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={20} fill="currentColor" /> Play Now
                  </button>
              </div>
           </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Clock className="text-red-500" /> Past Picks
        </h3>
        
        <div className="space-y-4">
            {data.history.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all">
                    <div className="w-24 text-sm font-bold text-gray-400 text-center uppercase tracking-wider">
                        {item.date}
                    </div>
                    <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                        <img src={item.song.albumCover} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="text-white font-bold">{item.song.title}</h4>
                        <p className="text-sm text-gray-400">{item.song.artist}</p>
                    </div>
                    <div className="hidden sm:block">
                        <span className={`text-xs px-2 py-1 rounded border ${item.song.platform === 'spotify' ? 'border-green-800 text-green-500' : 'border-red-800 text-red-500'}`}>
                            {item.song.platform}
                        </span>
                    </div>
                    <button onClick={() => handlePlay(item.song)} className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full">
                        <Play size={18} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongOfTheDay;
