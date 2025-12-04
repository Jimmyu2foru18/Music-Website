import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, Settings, LogOut, Music2, Check, Plus, Trash2, Play, Youtube } from 'lucide-react';
import { User, Playlist, Song } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dbUpdateUser, dbGetPlaylists, dbCreatePlaylist, dbDeletePlaylist, dbRemoveSongFromPlaylist } from '../services/db';
import { getSpotifyAuthUrl, isSpotifyConnected } from '../services/api';

const Profile: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  
  // Playlist Modal States
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [viewingPlaylist, setViewingPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    setTempUser(user);
    loadPlaylists();
    
    // Check Spotify Connection
    setSpotifyConnected(isSpotifyConnected());
  }, [user, navigate]);

  const loadPlaylists = () => {
      if(user) {
        const allPlaylists = dbGetPlaylists();
        setPlaylists(allPlaylists.filter(p => p.creatorId === user.id));
      }
  };

  if (!user || !tempUser) return null;

  const handleEdit = () => {
    setTempUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (tempUser) {
        dbUpdateUser(tempUser);
        setUser(tempUser);
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempUser(user);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setTempUser({ ...tempUser, avatarUrl: url });
    }
  };

  const handleSpotifyConnect = () => {
      window.location.href = getSpotifyAuthUrl();
  };

  // Playlist Management
  const handleCreatePlaylist = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPlaylistName.trim()) return;
      
      const newPlaylist: Playlist = {
          id: `p_${Date.now()}`,
          name: newPlaylistName,
          creatorId: user.id,
          songs: [],
          coverUrl: 'https://picsum.photos/300/300?grayscale', // Default
          platform: 'mixed'
      };
      
      dbCreatePlaylist(newPlaylist);
      loadPlaylists();
      setNewPlaylistName('');
      setIsCreatingPlaylist(false);
  };

  const handleDeletePlaylist = (id: string) => {
      if(confirm('Are you sure you want to delete this playlist?')) {
          dbDeletePlaylist(id);
          setViewingPlaylist(null);
          loadPlaylists();
      }
  };

  const handleRemoveSong = (playlistId: string, songId: string) => {
      dbRemoveSongFromPlaylist(playlistId, songId);
      // Update local view
      if (viewingPlaylist) {
          setViewingPlaylist({
              ...viewingPlaylist,
              songs: viewingPlaylist.songs.filter(s => s.id !== songId)
          });
      }
      loadPlaylists();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      
      {/* Profile Header */}
      <div className="relative mb-20">
        {/* Banner */}
        <div className="h-60 w-full rounded-2xl bg-gradient-to-r from-red-900 to-black border-b-4 border-red-600 overflow-hidden">
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30"></div>
        </div>

        {/* Info Card */}
        <div className="absolute top-40 left-0 w-full px-4 sm:px-8">
            <div className="flex flex-col md:flex-row items-end gap-6">
                
                {/* Avatar */}
                <div className="relative group">
                    <div className="w-36 h-36 rounded-full border-4 border-black bg-neutral-800 overflow-hidden shadow-2xl">
                        <img 
                            src={isEditing ? tempUser.avatarUrl : user.avatarUrl} 
                            alt={user.username} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    {isEditing && (
                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    )}
                </div>

                {/* Text Info */}
                <div className="flex-grow mb-2">
                    {isEditing ? (
                        <div className="space-y-3 bg-black/80 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                            <div>
                                <label className="text-xs text-gray-400">Username</label>
                                <input 
                                    type="text" 
                                    value={tempUser.username} 
                                    onChange={(e) => setTempUser({...tempUser, username: e.target.value})}
                                    className="block w-full bg-transparent border-b border-red-500 text-2xl font-bold text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Bio</label>
                                <textarea 
                                    value={tempUser.bio} 
                                    onChange={(e) => setTempUser({...tempUser, bio: e.target.value})}
                                    className="block w-full bg-white/5 rounded p-2 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
                            <p className="text-gray-300 max-w-xl">{user.bio}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mb-4 flex gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium flex items-center gap-2">
                                <Save size={18} /> Save
                            </button>
                            <button onClick={handleCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full font-medium flex items-center gap-2">
                                <X size={18} /> Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-medium flex items-center gap-2 backdrop-blur-sm">
                            <Edit2 size={18} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-10">
         
         {/* Sidebar Stats */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Settings size={18} className="text-red-500"/> Account
                </h3>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-gray-400">
                        <span>Email</span>
                        <span className="text-white truncate max-w-[120px]">{user.email}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>ID</span>
                        <span className="text-white truncate max-w-[100px]">{user.id}</span>
                    </div>
                     <div className="flex justify-between text-gray-400">
                        <span>Plan</span>
                        <span className="text-red-500 font-bold">Free</span>
                    </div>
                    
                    {/* Spotify Connection Status */}
                    <div className="pt-4 border-t border-white/10">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 flex items-center gap-2"><Music2 size={14}/> Spotify</span>
                            {spotifyConnected ? (
                                <span className="text-green-500 text-xs font-bold flex items-center gap-1"><Check size={12}/> Connected</span>
                            ) : (
                                <span className="text-gray-500 text-xs">Not connected</span>
                            )}
                        </div>
                        {!spotifyConnected && (
                            <button 
                                onClick={handleSpotifyConnect}
                                className="w-full py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full text-xs transition-colors"
                            >
                                Connect Spotify
                            </button>
                        )}
                    </div>

                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </div>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">My Library</h2>
                {isCreatingPlaylist ? (
                    <form onSubmit={handleCreatePlaylist} className="flex gap-2 animate-in fade-in slide-in-from-right duration-200">
                        <input 
                            type="text" 
                            placeholder="Playlist Name..."
                            autoFocus
                            className="bg-black border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:border-red-500 focus:outline-none"
                            value={newPlaylistName}
                            onChange={e => setNewPlaylistName(e.target.value)}
                        />
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm font-bold">Create</button>
                        <button type="button" onClick={() => setIsCreatingPlaylist(false)} className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm">Cancel</button>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsCreatingPlaylist(true)} 
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
                    >
                        <Plus size={16} /> New Playlist
                    </button>
                )}
             </div>
             
             {/* Playlist Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {playlists.map(playlist => (
                     <button 
                        key={playlist.id} 
                        onClick={() => setViewingPlaylist(playlist)}
                        className="bg-neutral-900 border border-white/5 rounded-lg overflow-hidden hover:border-red-500/50 transition-colors group text-left relative"
                     >
                         <div className="h-40 bg-gray-800 relative">
                             <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white uppercase font-bold flex items-center gap-1">
                                {playlist.platform === 'spotify' && <Music2 size={10} className="text-green-500" />}
                                {playlist.platform === 'youtube' && <Youtube size={10} className="text-red-500" />}
                                {playlist.platform === 'mixed' && <span className="text-blue-400 text-[10px] font-bold">MIX</span>}
                                {playlist.platform}
                             </div>
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="bg-white/20 backdrop-blur rounded-full p-2">
                                    <Play size={24} className="text-white fill-current" />
                                 </div>
                             </div>
                         </div>
                         <div className="p-4">
                             <h3 className="font-bold text-white mb-1 truncate">{playlist.name}</h3>
                             <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
                         </div>
                     </button>
                 ))}
                 
                 {/* Empty State */}
                 {playlists.length === 0 && (
                     <div className="col-span-full py-12 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
                         <Music2 size={48} className="mx-auto text-gray-600 mb-4" />
                         <p className="text-gray-400">You haven't created any playlists yet.</p>
                         <button onClick={() => setIsCreatingPlaylist(true)} className="text-red-500 hover:text-red-400 font-bold mt-2">Create one now</button>
                     </div>
                 )}
             </div>
         </div>
      </div>

      {/* PLAYLIST DETAIL MODAL */}
      {viewingPlaylist && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-neutral-900 w-full max-w-4xl h-[80vh] rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                  
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-900/20 to-neutral-900 flex justify-between items-start">
                      <div className="flex gap-6 items-end">
                          <img src={viewingPlaylist.coverUrl} className="w-40 h-40 rounded shadow-2xl object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
                          <div>
                              <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Playlist</p>
                              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{viewingPlaylist.name}</h2>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <span className="text-white font-bold">{user.username}</span>
                                  <span>•</span>
                                  <span>{viewingPlaylist.songs.length} songs</span>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => setViewingPlaylist(null)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Songs List */}
                  <div className="flex-grow overflow-y-auto p-6">
                      {viewingPlaylist.songs.length === 0 ? (
                          <div className="text-center py-20 text-gray-500">
                              <p>This playlist is empty.</p>
                              <p className="text-sm mt-2">Go to Search to add songs!</p>
                              <button onClick={() => { setViewingPlaylist(null); navigate('/search'); }} className="mt-4 text-red-500 font-bold hover:underline">Search Songs</button>
                          </div>
                      ) : (
                          <div className="space-y-1">
                              {viewingPlaylist.songs.map((song, idx) => (
                                  <div key={idx} className="group grid grid-cols-12 items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                      <div className="col-span-1 text-gray-500 text-center font-mono text-sm">{idx + 1}</div>
                                      <div className="col-span-8 flex items-center gap-4">
                                          <img src={song.albumCover} className="w-10 h-10 rounded object-cover" alt="" referrerPolicy="no-referrer" />
                                          <div className="min-w-0">
                                              <p className="text-white font-bold truncate cursor-pointer hover:underline" onClick={() => window.playSong && window.playSong(song)}>{song.title}</p>
                                              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                                          </div>
                                      </div>
                                      <div className="col-span-2 text-right">
                                          {song.platform === 'spotify' ? <Music2 size={16} className="text-green-500 inline"/> : <Youtube size={16} className="text-red-500 inline"/>}
                                      </div>
                                      <div className="col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={() => handleRemoveSong(viewingPlaylist.id, song.id)}
                                            className="text-gray-500 hover:text-red-500"
                                            title="Remove from playlist"
                                          >
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>

                  {/* Footer Actions */}
                  <div className="p-4 border-t border-white/10 bg-neutral-900 flex justify-between">
                      <button onClick={() => handleDeletePlaylist(viewingPlaylist.id)} className="text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 px-4 py-2 hover:bg-red-900/20 rounded">
                          <Trash2 size={14} /> Delete Playlist
                      </button>
                      {viewingPlaylist.songs.length > 0 && (
                          <button onClick={() => window.playSong && window.playSong(viewingPlaylist.songs[0])} className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 font-bold flex items-center gap-2 shadow-lg shadow-red-900/20">
                             <Play size={18} fill="currentColor"/> Play All
                          </button>
                      )}
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};

export default Profile;