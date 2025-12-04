export interface Song {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  platform: 'spotify' | 'youtube';
  duration: string;
  uri?: string; // For Spotify URI or YouTube Video ID
  previewUrl?: string; // Audio preview URL
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  avatarUrl: string;
  bio: string;
  role: 'user' | 'admin'; // Added role
}

export interface Playlist {
  id: string;
  name: string;
  creatorId: string;
  songs: Song[];
  coverUrl: string;
  platform: 'mixed' | 'spotify' | 'youtube';
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  song: Song; // Linked real song object instead of just text
  rating: number;
  content: string;
  date: string;
}

export interface DayPick {
  date: string;
  song: Song;
}