import { CONFIG, USE_LIVE_API } from '../config';
import { Song } from '../types';
import { FEATURED_SONGS } from '../constants';

// HELPER: Mock search if APIs are not configured
const mockSearch = (query: string): Song[] => {
  console.log("Using Mock Search Data for:", query);
  return FEATURED_SONGS.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.artist.toLowerCase().includes(query.toLowerCase())
  ).map(s => ({...s, id: Math.random().toString()}));
};

// --- SPOTIFY IMPLICIT GRANT FLOW ---

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  TOKEN_EXPIRY: 'spotify_token_expiry'
};

export const getSpotifyAuthUrl = () => {
  const scopes = 'user-read-private user-read-email';
  console.log("Melody View: Redirecting to Spotify with URI:", CONFIG.spotify.redirectUri);
  return `https://accounts.spotify.com/authorize?client_id=${CONFIG.spotify.clientId}&redirect_uri=${encodeURIComponent(CONFIG.spotify.redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
};

export const handleSpotifyCallback = () => {
  // Check URL hash for token
  const hash = window.location.hash;
  // Handle case where hash contains the route (HashRouter) AND the token
  // Spotify returns: #access_token=...
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1)); // remove #
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in'); // usually 3600 seconds
    
    if (token && expiresIn) {
      const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      // Clean URL hash so HashRouter doesn't get confused
      window.location.hash = ''; 
      return true;
    }
  }
  return false;
};

const getSpotifyToken = (): string | null => {
  if (CONFIG.spotify.clientId.includes('YOUR_')) return null;

  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

  if (token && expiry && Date.now() < parseInt(expiry)) {
    return token;
  }
  
  return null; // Token expired or missing
};

export const isSpotifyConnected = (): boolean => {
    return !!getSpotifyToken();
};

// PUBLIC API FUNCTIONS

export const searchMusic = async (query: string): Promise<Song[]> => {
  if (!USE_LIVE_API) return mockSearch(query);

  const results: Song[] = [];

  // 1. Search YouTube
  if (CONFIG.youtube.apiKey && !CONFIG.youtube.apiKey.includes('YOUR_')) {
    try {
      const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&type=video&key=${CONFIG.youtube.apiKey}`);
      
      if (!ytRes.ok) {
          console.error("Melody View: YouTube API Error", await ytRes.text());
      } else {
          const ytData = await ytRes.json();
          if (ytData.items) {
            results.push(...ytData.items.map((item: any) => ({
              id: item.id.videoId,
              title: item.snippet.title,
              artist: item.snippet.channelTitle,
              albumCover: item.snippet.thumbnails.high.url,
              platform: 'youtube' as const,
              duration: 'Video', 
              uri: item.id.videoId
            })));
          }
      }
    } catch (e) { console.error("YouTube Search Failed", e); }
  }

  // 2. Search Spotify
  try {
    const token = getSpotifyToken();
    if (token) {
      const spRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (spRes.status === 401) {
          // Token expired
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          console.warn("Spotify token expired. Please reconnect.");
      } else {
          const spData = await spRes.json();
          if (spData.tracks) {
            results.push(...spData.tracks.items.map((item: any) => ({
              id: item.id,
              title: item.name,
              artist: item.artists[0].name,
              albumCover: item.album.images[0].url,
              platform: 'spotify' as const,
              duration: new Date(item.duration_ms).toISOString().slice(14, 19),
              uri: item.uri,
              previewUrl: item.preview_url
            })));
          }
      }
    } else {
        console.warn("Spotify not connected. Call getSpotifyAuthUrl() to connect.");
    }
  } catch (e) { console.error("Spotify Search Failed", e); }

  // Fallback if APIs return nothing
  return results.length > 0 ? results : mockSearch(query);
};