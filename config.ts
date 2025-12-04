// CONFIGURATION FILE
// ==================
// INSTRUCTIONS:
// 1. SPOTIFY: Go to https://developer.spotify.com/dashboard
//    - Create an App.
//    - Copy "Client ID". 
//    - Edit Settings -> Redirect URIs:
//      You must add BOTH URLs (Local and Live):
//      
//      1. Local: http://localhost:5173/
//      2. Live:  https://jimmyu2foru18.github.io/Music-Website/
//
//      (Ensure you include the trailing slash / for both!)
//
// 2. YOUTUBE: Go to https://console.cloud.google.com/
//    - Create a Project.
//    - Enable "YouTube Data API v3".
//    - Create API Key.

const getRedirectUri = () => {
  let uri = window.location.origin + window.location.pathname;
  // Ensure consistency: Spotify requires an exact match.
  // We force a trailing slash to handle both 'localhost:5173' and 'github.io/repo/' correctly.
  return uri.endsWith('/') ? uri : uri + '/';
};

export const CONFIG = {
  spotify: {
    clientId: '57f3d77f967247c1b5a3f0a5b250a8ff',       
    // Automatically generates the correct redirect URI based on your current browser URL.
    redirectUri: getRedirectUri(), 
  },
  youtube: {
    apiKey: 'AIzaSyDUrAtpTT3ezacpPosd4XFhVxWf0VGyKwY',
  }
};

export const USE_LIVE_API = true;