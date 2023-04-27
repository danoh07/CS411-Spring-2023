var SpotifyWebApi = require('spotify-web-api-node');
const {google} = require('googleapis');

// Use your own API credentials
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CLIENT_REDIRECT_URI
  );

const convertSpotifyPlaylistToYoutube = async (req, res) => {
  try {

      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://localhost:8888/api/spotify/callback'
      });

      spotifyApi.setAccessToken(req.session.spotifyAccessToken)
    

      const {spotifyPlaylistId} = req.params
      // Fetch the playlist details and tracks from Spotify
      const playlistData = await spotifyApi.getPlaylist(spotifyPlaylistId);
      const trackData = await spotifyApi.getPlaylistTracks(spotifyPlaylistId);
    
      // Extract the playlist name and tracks
      const playlistDescription = playlistData.body.description;
      const playlistName = playlistData.body.name;
      const tracks = trackData.body.items.map(item => item.track);

      oauth2Client.setCredentials({
          access_token: req.session.googleAccessToken
      });
      // Configure YouTube API client
      const youtubeApi = google.youtube({
          version: 'v3',
          auth: oauth2Client,
      });
    
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

        // Use the `playlists.insert()` method to create a new playlist
        const response = await youtubeApi.playlists.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: playlistName,
                    description: playlistDescription
                },
                status: {
                    privacyStatus: 'PRIVATE'
                }
            }
        });

        const playlistId = response.data.id;

        // Add the found videos to the newly created YouTube playlist
        const addVideosToPlaylist = async () => {
          for (const video of youtubeVideos) {
            await youtubeApi.playlistItems.insert({
              part: 'snippet',
              requestBody: {
                snippet: {
                  playlistId: playlistId,
                  resourceId: {
                    kind: 'youtube#video',
                    videoId: video.id.videoId,
                  },
                },
              },
            });
          }
        };

        addVideosToPlaylist()
        console.log(response)
        console.log(response.data)
        res.status(200).json(response.data)

  } catch (error) {
      console.log(error)
      res.status(400).json({error: error})
  }

}
  

const convertYoutubePlaylistToSpotify = async (req, res) => {
  try {
      const {youtubePlaylistId} = req.params
      console.log(youtubePlaylistId)

      oauth2Client.setCredentials({
          access_token: req.session.googleAccessToken
      })
      // Configure YouTube API client
      const youtubeApi = google.youtube({
          version: 'v3',
          auth: oauth2Client,
      })
      
      // Fetch the playlist details and videos from YouTube
      const playlistData = await youtubeApi.playlists.list({
        part: 'snippet',
        id: youtubePlaylistId,
      })
      
      console.log(playlistData)
      const videoData = await youtubeApi.playlistItems.list({
        part: 'snippet',
        playlistId: youtubePlaylistId,
        maxResults: 100, // Adjust this value based on the playlist size
      })
      
      // Extract the playlist name and video titles
      const playlistName = playlistData.data.items[0].snippet.title;
      const playlistDescription = playlistData.data.items[0].snippet.description;
      const videos = videoData.data.items.map(item => item.snippet);
      

      const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://localhost:8888/api/spotify/callback'
      });

      spotifyApi.setAccessToken(req.session.spotifyAccessToken)


      // Search for Spotify tracks corresponding to the YouTube videos
      const spotifyTrackPromises = videos.map(async video => {

        const SearchOptions = {
          limit: 10,
          market: ['US', 'KR']
        } 

        const searchQuery = video.title;
        const response = await spotifyApi.searchTracks(searchQuery, SearchOptions);
    
        return response.body.tracks.items[0]
      })
    
      const spotifyTracks = await Promise.all(spotifyTrackPromises)
    
      const createdPlaylist = await spotifyApi.createPlaylist(playlistName, playlistDescription)

      const trackUris = spotifyTracks.map(track => track.uri)

      await spotifyApi.addTracksToPlaylist(createdPlaylist.body.id, trackUris)

      res.status(200).send(createdPlaylist)

  } catch (error) {
      console.log(error)
      res.status(400).json({error: error})
  }
}
  
module.exports = {
  convertSpotifyPlaylistToYoutube,
  convertYoutubePlaylistToSpotify,
};


