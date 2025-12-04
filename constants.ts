import { Song, Playlist, Review, DayPick, User } from './types';

// Initial Mock Data to seed the "Database" if empty

export const MOCK_USER: User = {
  id: 'u1',
  username: 'MelodyFan99',
  email: 'user@example.com',
  password: 'password123',
  avatarUrl: 'https://picsum.photos/200/200?random=1',
  bio: 'Music enthusiast. Lover of rock and electronic beats. Building the ultimate playlist collection.',
  role: 'user'
};

export const ADMIN_USER: User = {
  id: 'admin1',
  username: 'Admin',
  email: 'admin@melodyview.com',
  password: 'admin123',
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff',
  bio: 'Platform Administrator',
  role: 'admin'
};

export const FEATURED_SONGS: Song[] = [
  {
    id: 's1',
    title: 'Midnight City',
    artist: 'M83',
    albumCover: 'https://picsum.photos/300/300?random=2',
    platform: 'spotify',
    duration: '4:03',
    uri: 'spotify:track:1eyzqe2QqGZUmfcPZtrIyt'
  },
  {
    id: 's2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumCover: 'https://picsum.photos/300/300?random=3',
    platform: 'youtube',
    duration: '5:55',
    uri: 'fJ9rUzIMcZQ'
  },
  {
    id: 's3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: 'https://picsum.photos/300/300?random=4',
    platform: 'spotify',
    duration: '3:20',
    uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b'
  },
  {
    id: 's4',
    title: 'Hotel California',
    artist: 'Eagles',
    albumCover: 'https://picsum.photos/300/300?random=5',
    platform: 'spotify',
    duration: '6:30',
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Gym Hype',
    creatorId: 'u1',
    songs: [FEATURED_SONGS[2]],
    coverUrl: 'https://picsum.photos/300/300?random=10',
    platform: 'spotify',
  },
  {
    id: 'p2',
    name: 'Chill Sunday',
    creatorId: 'u1',
    songs: [FEATURED_SONGS[0]],
    coverUrl: 'https://picsum.photos/300/300?random=11',
    platform: 'mixed',
  },
  {
    id: 'p3',
    name: 'Code Focus',
    creatorId: 'u1',
    songs: [FEATURED_SONGS[1]],
    coverUrl: 'https://picsum.photos/300/300?random=12',
    platform: 'youtube',
  },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u2',
    username: 'RockStar',
    userAvatar: 'https://picsum.photos/100/100?random=20',
    song: FEATURED_SONGS[3], // Hotel California
    rating: 5,
    content: 'An absolute masterpiece. The guitar solo at the end is timeless.',
    date: '2023-10-25',
  },
  {
    id: 'r2',
    userId: 'u3',
    username: 'PopQueen',
    userAvatar: 'https://picsum.photos/100/100?random=21',
    song: {
        id: 's_mock_espresso',
        title: 'Espresso',
        artist: 'Sabrina Carpenter',
        albumCover: 'https://picsum.photos/300/300?random=99',
        platform: 'spotify',
        duration: '2:55'
    },
    rating: 4,
    content: 'Super catchy, but gets stuck in your head a bit too easily!',
    date: '2023-10-24',
  },
];

// Fallback initial SOTD (Used by db service if storage empty)
export const INITIAL_SOTD: DayPick = {
  date: new Date().toLocaleDateString(),
  song: FEATURED_SONGS[0],
};