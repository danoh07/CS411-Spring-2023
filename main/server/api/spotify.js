const SpotifyWebApi = require('spotify-web-api-node');

// Configure Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Set the access token
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);

module.exports = spotifyApi;
