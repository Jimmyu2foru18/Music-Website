import React, { useState, useEffect } from 'react';
import { X, Plus, Music, Check } from 'lucide-react';
import { Song, Playlist } from '../types';
import { dbGetPlaylists, dbCreatePlaylist, dbAddSongToPlaylist } from '../services/db';
import { useAuth } from '../context/AuthContext';

interface PlaylistSelectorProps {
  song: Song;
  onClose: () => void;
}

export const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ song, onClose }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (user) {
        const all = dbGetPlaylists();
        setPlaylists(all.filter(p => p.creatorId === user.id));
    }
  }, [user]);

  const handleAddToPlaylist = (playlistId: string) => {
    dbAddSongToPlaylist(playlistId, song);
    onClose();
    // Ideally show a toast notification here
    alert(`Added "${song.title}" to playlist!`);
  };

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
        id: `p_${Date.now()}`,
        name: newPlaylistName,
        creatorId: user.id,
        songs: [song],
        coverUrl: song.albumCover, // Use the song's cover as the initial playlist cover
        platform: song.platform === 'spotify' ? 'spotify' : 'youtube'
    };

    dbCreatePlaylist(newPlaylist);
    onClose();
    alert(`Created playlist "${newPlaylistName}" and added song!`);
  };

  if (!user) {
      return (
          <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-neutral-900 p-6 rounded-2xl max-w-sm w-full text-center border border-white/10">
                  <p className="text-white mb-4">Please login to add songs to playlists.</p>
                  <button onClick={onClose} className="px-4 py-2 bg-red-600 rounded-full text-white font-bold">Close</button>
              </div>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-neutral-800">
            <h3 className="font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-red-500" /> Add to Playlist
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={20} />
            </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
            {/* Song Preview */}
            <div className="flex items-center gap-3 mb-6 bg-black/40 p-3 rounded-lg">
                <img 
                    src={song.albumCover} 
                    className="w-12 h-12 rounded object-cover" 
                    alt="" 
                    referrerPolicy="no-referrer"
                />
                <div>
                    <p className="text-sm font-bold text-white">{song.title}</p>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                </div>
            </div>

            {/* List */}
            <div className="space-y-2">
                {playlists.map(p => (
                    <button 
                        key={p.id}
                        onClick={() => handleAddToPlaylist(p.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors group text-left"
                    >
                        <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden relative">
                            <img 
                                src={p.coverUrl} 
                                className="w-full h-full object-cover" 
                                alt="" 
                                referrerPolicy="no-referrer"
                            />
                            {p.songs.some(s => s.id === song.id) && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Check size={16} className="text-green-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <p className="text-white font-medium text-sm">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.songs.length} songs</p>
                        </div>
                        <Plus size={16} className="text-gray-500 group-hover:text-white" />
                    </button>
                ))}
            </div>

            {/* Create New */}
            {!isCreating ? (
                <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full mt-4 py-3 border border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-white transition-colors flex items-center justify-center gap-2 text-sm font-bold"
                >
                    <Plus size={16} /> New Playlist
                </button>
            ) : (
                <form onSubmit={handleCreatePlaylist} className="mt-4 bg-white/5 p-3 rounded-xl">
                    <input 
                        type="text" 
                        autoFocus
                        placeholder="Playlist Name"
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none mb-3"
                        value={newPlaylistName}
                        onChange={e => setNewPlaylistName(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg">Create</button>
                        <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg">Cancel</button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};