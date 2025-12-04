import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, X, Music2, Youtube, Loader } from 'lucide-react';
import { dbGetReviews, dbAddReview } from '../services/db';
import { searchMusic } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Review, Song } from '../types';

const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Form State
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  useEffect(() => {
    setReviews(dbGetReviews());
  }, []);

  // Handle live search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchQuery.length > 2 && !selectedSong) {
            setIsSearching(true);
            const results = await searchMusic(searchQuery);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedSong]);

  const handleSelectSong = (song: Song) => {
      setSelectedSong(song);
      setSearchQuery('');
      setSearchResults([]);
  };

  const handleClearSong = () => {
      setSelectedSong(null);
      setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to post a review");
        return;
    }
    if (!selectedSong) {
        alert("Please select a song to review");
        return;
    }

    const newReview: Review = {
      id: Math.random().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatarUrl,
      song: selectedSong, // Linking the real song object
      rating: rating,
      content: content,
      date: new Date().toISOString().split('T')[0]
    };

    dbAddReview(newReview);
    setReviews(dbGetReviews()); // Refresh list
    // Reset form
    setSelectedSong(null);
    setRating(5);
    setContent('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Review Form - Sticky on Desktop */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-neutral-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-red-500" /> Write a Review
            </h2>
            
            {!user ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm mb-4">Join the community to share your thoughts on your favorite tracks.</p>
                    <a href="#/login" className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-colors">Sign In</a>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Song Selection */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Song</label>
                        
                        {selectedSong ? (
                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-red-500/50 relative group">
                                <img src={selectedSong.albumCover} alt="" className="w-12 h-12 rounded object-cover" />
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-white text-sm truncate">{selectedSong.title}</h4>
                                    <p className="text-xs text-gray-400 truncate">{selectedSong.artist}</p>
                                </div>
                                <div className="ml-auto">
                                    {selectedSong.platform === 'spotify' ? <Music2 size={16} className="text-green-500"/> : <Youtube size={16} className="text-red-500"/>}
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleClearSong}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-gray-500"/>
                                </div>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-black border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-sm"
                                    placeholder="Search song title..."
                                />
                                {isSearching && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Loader size={16} className="text-red-500 animate-spin"/>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Dropdown Results */}
                        {searchResults.length > 0 && !selectedSong && (
                            <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                                {searchResults.map(song => (
                                    <button
                                        key={song.id}
                                        type="button"
                                        onClick={() => handleSelectSong(song)}
                                        className="w-full text-left flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <img src={song.albumCover} alt="" className="w-10 h-10 rounded object-cover" />
                                        <div className="flex-grow min-w-0">
                                            <p className="text-white text-sm font-bold truncate">{song.title}</p>
                                            <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                                        </div>
                                        {song.platform === 'spotify' ? <Music2 size={14} className="text-green-500 flex-shrink-0"/> : <Youtube size={14} className="text-red-500 flex-shrink-0"/>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star} 
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-500' : 'text-gray-700'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Review</label>
                        <textarea 
                            required
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors h-32 resize-none text-sm leading-relaxed"
                            placeholder="Share your opinion on the track..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={!selectedSong || !content}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-900/20"
                    >
                        Post Review
                    </button>
                </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Community Feed</h2>
            {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/20 transition-colors group">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Song Art (Clickable to play) */}
                        <div className="flex-shrink-0 relative w-full sm:w-32 aspect-square rounded-xl overflow-hidden cursor-pointer" onClick={() => window.playSong && window.playSong(review.song)}>
                             <img src={review.song.albumCover} alt={review.song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white">
                                     <Music2 size={24} fill="currentColor" />
                                 </div>
                             </div>
                             <div className="absolute top-2 right-2">
                                {review.song.platform === 'spotify' ? <div className="bg-black/80 p-1 rounded-full"><Music2 size={12} className="text-green-500"/></div> : <div className="bg-black/80 p-1 rounded-full"><Youtube size={12} className="text-red-500"/></div>}
                             </div>
                        </div>

                        {/* Review Content */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-white hover:text-red-500 transition-colors cursor-pointer" onClick={() => window.playSong && window.playSong(review.song)}>
                                        {review.song.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{review.song.artist}</p>
                                </div>
                                <div className="flex bg-yellow-500/10 px-2 py-1 rounded-lg text-yellow-500 gap-1">
                                    <span className="font-bold">{review.rating}</span> <Star size={16} fill="currentColor" />
                                </div>
                            </div>
                            
                            <p className="text-gray-300 leading-relaxed text-sm mb-4 bg-black/30 p-4 rounded-lg border border-white/5">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                                <img src={review.userAvatar} alt={review.username} className="w-8 h-8 rounded-full border border-white/10" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">{review.username}</span>
                                    <span className="text-[10px] text-gray-500">{review.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Reviews;