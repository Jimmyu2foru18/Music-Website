import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Save, X, Settings, LogOut, Music2, Check } from 'lucide-react';
import { User, Playlist } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { dbUpdateUser, dbGetPlaylists } from '../services/db';
import { getSpotifyAuthUrl, isSpotifyConnected } from '../services/api';

const Profile: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    setTempUser(user);
    // Load playlists from DB
    const allPlaylists = dbGetPlaylists();
    setPlaylists(allPlaylists.filter(p => p.creatorId === user.id));
    
    // Check Spotify Connection
    setSpotifyConnected(isSpotifyConnected());
  }, [user, navigate]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
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
             <h2 className="text-2xl font-bold text-white mb-6">My Library</h2>
             
             {/* Playlist Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {playlists.map(playlist => (
                     <div key={playlist.id} className="bg-neutral-900 border border-white/5 rounded-lg overflow-hidden hover:border-red-500/50 transition-colors">
                         <div className="h-40 bg-gray-800 relative">
                             <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
                             <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white uppercase font-bold">
                                 {playlist.platform}
                             </div>
                         </div>
                         <div className="p-4">
                             <h3 className="font-bold text-white mb-1">{playlist.name}</h3>
                             <p className="text-xs text-gray-400">{playlist.songs.length} songs</p>
                         </div>
                     </div>
                 ))}
                 
                 {/* Add New Placeholder */}
                 <button className="h-full min-h-[220px] bg-white/5 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-white/10 transition-all group">
                     <div className="w-12 h-12 rounded-full border-2 border-gray-400 group-hover:border-red-500 flex items-center justify-center mb-2">
                         <span className="text-2xl group-hover:text-red-500">+</span>
                     </div>
                     <span className="font-medium">Create Playlist</span>
                 </button>
             </div>
         </div>

      </div>
    </div>
  );
};

export default Profile;