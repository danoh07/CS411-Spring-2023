const spotifyApi = require('../spotify');
const youtubeApi = require('../youtube');

async function convertSpotifyPlaylistToYoutube(spotifyPlaylistId) {
    // Fetch the playlist details and tracks from Spotify
    const playlistData = await spotifyApi.getPlaylist(spotifyPlaylistId);
    const trackData = await spotifyApi.getPlaylistTracks(spotifyPlaylistId);
  
    // Extract the playlist name and tracks
    const playlistName = playlistData.body.name;
    const tracks = trackData.body.items.map(item => item.track);
  
    // Search for YouTube videos corresponding to the Spotify tracks
    const youtubeVideoPromises = tracks.map(async track => {
      const searchQuery = `${track.name} ${track.artists[0].name}`;
      const response = await youtubeApi.search.list({
        part: 'id',
        q: searchQuery,
        type: 'video',
        videoDefinition: 'high',
        maxResults: 1,
      });
  
      return response.data.items[0];
    });
  
    const youtubeVideos = await Promise.all(youtubeVideoPromises);
  
    // TODO: Create a YouTube playlist and add the found videos to it
  }
  

async function convertYoutubePlaylistToSpotify(youtubePlaylistId) {
    // Fetch the playlist details and videos from YouTube
    const playlistData = await youtubeApi.playlists.list({
      part: 'snippet',
      id: youtubePlaylistId,
    });
  
    const videoData = await youtubeApi.playlistItems.list({
      part: 'snippet',
      playlistId: youtubePlaylistId,
      maxResults: 50, // Adjust this value based on the playlist size
    });
  
    // Extract the playlist name and video titles
    const playlistName = playlistData.data.items[0].snippet.title;
    const videos = videoData.data.items.map(item => item.snippet);
  
    // Search for Spotify tracks corresponding to the YouTube videos
    const spotifyTrackPromises = videos.map(async video => {
      const searchQuery = video.title;
      const response = await spotifyApi.searchTracks(searchQuery);
  
      return response.body.tracks.items[0];
    });
  
    const spotifyTracks = await Promise.all(spotifyTrackPromises);
  
    // TODO: Create a Spotify playlist and add the found tracks to it
  }
  
module.exports = {
  convertSpotifyPlaylistToYoutube,
  convertYoutubePlaylistToSpotify,
};


