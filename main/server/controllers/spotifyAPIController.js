var SpotifyWebApi = require('spotify-web-api-node');

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:8888/api/spotify/callback'
  });

const getAuthUrl =  (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
}

const callback = (req, res) => {

    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log('access_token:', access_token);

        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );

        res.redirect('http://localhost:3000/' + `?AccessToken=${access_token}`)


      }).catch(error => {
          console.error('Error getting Tokens:', error);
          res.send(`Error getting Tokens: ${error}`);
        });

  }

  const getMe = async (req, res, next) => {
    try { 

      const profile = await spotifyApi.getMe()

      req.profile = profile
      next()

    } catch (error) {
      res.status(400).json({error: error})
    }
  }

  const getPlaylist = async (req, res) => {
    try {
      const profile = req.profile
      const response = await spotifyApi.getUserPlaylists(profile.body.id)
      console.log(response.body)

      res.status(200).json(response)
      
    } catch (error) {
      res.status(400).json({error: error})
      
    }
  }

  const searchTrack = async (req, res) => {
    try { 

    const { searchParam }  = req.params

    const SearchOptions = {
      limit: 10,
      market: ['US', 'KR']
    } 

    const response = await spotifyApi.searchTracks(searchParam, SearchOptions)

    res.status(200).json(response)

    } catch (error) {
      res.status(400).json({error: error})
    }
  }

  const createPlaylist = async (req, res) => {
    try {
      const { playlistName, playlistDescription } = req.body

      const createdPlaylist = await spotifyApi.createPlaylist(playlistName, playlistDescription)

      res.status(200).json(createdPlaylist)

    } catch (error) {
      res.status(400).json({error: error})
    }
  } 
  const addTrackstoPlaylist = async (req, res) => {
    try {
      const { playlistId , tracks } = req.body

      const updatedPlaylist = await spotifyApi.addTracksToPlaylist(playlistId, tracks)

      res.status(200).json(updatedPlaylist)

    } catch (error) {
      res.status(400).json({error: error})
    }
  } 

  const logOut = (req, res) => {
    try {
      spotifyApi.resetAccessToken()
      spotifyApi.resetRefreshToken()

      res.status(200)

    } catch (error) {
      res.status(400).json({error: error})
    }
  }

  module.exports = {
    callback,
    getAuthUrl,
    getMe,
    getPlaylist,
    searchTrack,
    createPlaylist,
    addTrackstoPlaylist,
    logOut
  };
  