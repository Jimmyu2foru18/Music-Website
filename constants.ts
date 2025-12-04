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
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273297a7a505b22591a457c7c35',
    platform: 'spotify',
    duration: '4:03',
    uri: 'spotify:track:1eyzqe2QqGZUmfcPZtrIyt'
  },
  {
    id: 's2',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    albumCover: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    platform: 'youtube',
    duration: '5:55',
    uri: 'fJ9rUzIMcZQ'
  },
  {
    id: 's3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    platform: 'spotify',
    duration: '3:20',
    uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b'
  },
  {
    id: 's4',
    title: 'Hotel California',
    artist: 'Eagles',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273e35798a7263598f822187a53',
    platform: 'spotify',
    duration: '6:30',
    uri: 'spotify:track:40riOy7x9W7GXjyGp4pjAv'
  },
  {
    id: 's5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    platform: 'spotify',
    duration: '3:53',
    uri: 'spotify:track:7qiZfU4dY1lWllzX7mPBI3'
  },
  {
    id: 's6',
    title: 'Levitating',
    artist: 'Dua Lipa',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
    platform: 'spotify',
    duration: '3:23',
    uri: 'spotify:track:5nujrmhLynf4yMoMtj8AQF'
  },
  {
    id: 's7',
    title: 'Despacito',
    artist: 'Luis Fonsi',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b2735447209353e4b3c4349479b4',
    platform: 'spotify',
    duration: '3:48',
    uri: 'spotify:track:6habFhsOp2NvshLv26DqMb'
  },
  {
    id: 's8',
    title: 'Cruel Summer',
    artist: 'Taylor Swift',
    albumCover: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647',
    platform: 'spotify',
    duration: '2:58',
    uri: 'spotify:track:1BxfuPKGuaTgP7aM0BzxDQ'
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
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3918e0d5',
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