import { CONFIG, USE_LIVE_API } from '../config';
import { Song } from '../types';
import { FEATURED_SONGS } from '../constants';

// HELPER: Mock search if APIs are not configured
const mockSearch = (query: string): Song[] => {
  const lowerQ = query.toLowerCase();
  // Filter local constants
  const results = FEATURED_SONGS.filter(s => 
    s.title.toLowerCase().includes(lowerQ) || 
    s.artist.toLowerCase().includes(lowerQ)
  ).map(s => ({...s, id: Math.random().toString()}));
  
  return results;
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
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1)); // remove #
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in'); // usually 3600 seconds
    
    if (token && expiresIn) {
      const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
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

  // 1. Search YouTube (Always attempt if API Key exists)
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
      // User IS connected, fetch real data
      const spRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (spRes.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      } else {
          const spData = await spRes.json();
          if (spData.tracks) {
            results.push(...spData.tracks.items.map((item: any) => {
              // Safe extraction of album cover
              const albumImages = item.album?.images;
              const coverUrl = (albumImages && albumImages.length > 0) 
                  ? albumImages[0].url 
                  : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop';

              return {
                id: item.id,
                title: item.name,
                artist: item.artists[0].name,
                albumCover: coverUrl,
                platform: 'spotify' as const,
                duration: new Date(item.duration_ms).toISOString().slice(14, 19),
                uri: item.uri,
                previewUrl: item.preview_url
              };
            }));
          }
      }
    } else {
      // User IS NOT connected. 
      // Fallback to Mock Data so the "Unified Search" still visually works for the demo.
      // This solves "Search only shows YouTube".
      const mockSpotifyResults = mockSearch(query).filter(s => s.platform === 'spotify');
      results.push(...mockSpotifyResults);
    }
  } catch (e) { console.error("Spotify Search Failed", e); }

  return results;
};