import { User, Playlist, Review, Song, DayPick } from '../types';
import { MOCK_USER, ADMIN_USER, MOCK_PLAYLISTS, MOCK_REVIEWS, FEATURED_SONGS } from '../constants';

// SIMULATED DATABASE SERVICE
// ==========================
// This service mimics SQL database interactions using localStorage.

const STORAGE_KEYS = {
  USERS: 'mv_users',
  CURRENT_USER: 'mv_current_user',
  PLAYLISTS: 'mv_playlists',
  REVIEWS: 'mv_reviews',
  SOTD: 'mv_sotd',
  SOTD_HISTORY: 'mv_sotd_history',
};

// --- USER AUTHENTICATION & MANAGEMENT ---

const initUsers = (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
        // Seed with default user AND admin
        const initialUsers = [MOCK_USER, ADMIN_USER];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        return initialUsers;
    }
    return JSON.parse(stored);
}

export const dbRegister = (user: Omit<User, 'id' | 'avatarUrl' | 'bio' | 'role'>): User => {
  const users = initUsers();
  
  if (users.find((u: User) => u.email === user.email)) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    ...user,
    id: `u_${Date.now()}`,
    avatarUrl: 'https://picsum.photos/200/200?random=' + Date.now(),
    bio: 'Music lover joining Melody View.',
    role: 'user' // Default role
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  return newUser;
};

export const dbLogin = (email: string, password: string): User => {
  const users = initUsers();
  const user = users.find((u: User) => u.email === email && u.password === password);
  
  if (!user) throw new Error('Invalid credentials');
  
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
};

export const dbLogout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const dbUpdateUser = (updatedUser: User) => {
  const users = initUsers();
  const index = users.findIndex((u: User) => u.id === updatedUser.id);
  
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
  }
};

export const dbGetCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

// --- ADMIN FUNCTIONS ---

export const dbGetAllUsers = (): User[] => {
    return initUsers();
};

export const dbDeleteUser = (userId: string) => {
    let users = initUsers();
    // Prevent deleting the last admin
    const userToDelete = users.find(u => u.id === userId);
    if(userToDelete?.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
        throw new Error("Cannot delete the only administrator.");
    }
    
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

// --- DATA MANAGEMENT ---

export const dbGetPlaylists = (): Playlist[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(MOCK_PLAYLISTS));
    return MOCK_PLAYLISTS;
  }
  return JSON.parse(stored);
};

export const dbCreatePlaylist = (playlist: Playlist) => {
  const playlists = dbGetPlaylists();
  playlists.push(playlist);
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};

export const dbDeletePlaylist = (playlistId: string) => {
  let playlists = dbGetPlaylists();
  playlists = playlists.filter(p => p.id !== playlistId);
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};

export const dbAddSongToPlaylist = (playlistId: string, song: Song) => {
  const playlists = dbGetPlaylists();
  const index = playlists.findIndex(p => p.id === playlistId);
  if (index !== -1) {
      // Avoid duplicates
      if (!playlists[index].songs.some(s => s.id === song.id)) {
          playlists[index].songs.push(song);
          
          // Update platform tag if mixed
          const hasSpotify = playlists[index].songs.some(s => s.platform === 'spotify');
          const hasYoutube = playlists[index].songs.some(s => s.platform === 'youtube');
          if (hasSpotify && hasYoutube) playlists[index].platform = 'mixed';
          else if (hasSpotify) playlists[index].platform = 'spotify';
          else if (hasYoutube) playlists[index].platform = 'youtube';

          localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
      }
  }
};

export const dbRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    const playlists = dbGetPlaylists();
    const index = playlists.findIndex(p => p.id === playlistId);
    if (index !== -1) {
        playlists[index].songs = playlists[index].songs.filter(s => s.id !== songId);
        localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    }
};

export const dbGetReviews = (): Review[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS));
    return MOCK_REVIEWS;
  }
  return JSON.parse(stored);
};

export const dbAddReview = (review: Review) => {
  const reviews = dbGetReviews();
  reviews.unshift(review); 
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

// --- SONG OF THE DAY LOGIC ---

export const dbGetSongOfTheDay = (): { today: DayPick, history: DayPick[] } => {
  const todayStr = new Date().toLocaleDateString();
  const storedSotd = localStorage.getItem(STORAGE_KEYS.SOTD);
  const storedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.SOTD_HISTORY) || '[]');

  let todayPick: DayPick;

  if (storedSotd) {
    todayPick = JSON.parse(storedSotd);
    
    if (todayPick.date !== todayStr) {
      storedHistory.unshift(todayPick);
      if (storedHistory.length > 30) storedHistory.pop(); 
      localStorage.setItem(STORAGE_KEYS.SOTD_HISTORY, JSON.stringify(storedHistory));

      const randomSong = FEATURED_SONGS[Math.floor(Math.random() * FEATURED_SONGS.length)];
      todayPick = { date: todayStr, song: randomSong };
      localStorage.setItem(STORAGE_KEYS.SOTD, JSON.stringify(todayPick));
    }
  } else {
    todayPick = { date: todayStr, song: FEATURED_SONGS[0] };
    localStorage.setItem(STORAGE_KEYS.SOTD, JSON.stringify(todayPick));
  }

  return { today: todayPick, history: storedHistory };
};