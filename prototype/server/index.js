require('dotenv').config();
var querystring = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');
let request = require('request');
const express = require('express');
const cors = require('cors');

// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

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
  

// ORIGINAL (with added spotify code)

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:8888/callback'
  });
  
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scopes,
      redirect_uri: 'http://localhost:8888/callback'
    }))
    //res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

  app.get('/callback', function(req, res) {
    const error = req.query.error;
    const code = req.query.code || null
    const state = req.query.state;

    let authOptions = {
      url: 'https://accounts.spotify.com/api/tokens',
      form: {
        code: code,
        redirect_uri: 'http://localhost:8888/callback',
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization' : 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true
    }
      request.post(authOptions, function(error, response, body) {
        var access_token = body.access_token
        let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
        res.redirect(uri + '?access_token=' + access_token)
      })
    
    
    if (error) {
      console.error('Callback Error:', error);
      // res.send(`Callback Error: ${error}`);
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
        console.log('refresh_token:', refresh_token);
  
        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
  
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });


  let port = process.env.PORT || 8888
  console.log('Listening on port ${port}: Go /login to initiate authentication flow.')
  app.listen(port)


  app.get('/search_playlist_by_artist/:artist', async (req, res) => {
    const { artist } = req.params;

    console.log(artist);

    if (!artist) {
        res.status(418)
    }

    var artistID = await spotifyApi.searchArtists(`${artist}`)
      .then(data => { console.log(data); return data.body.artists.items[0].id})

    // Get retuest with Arist Id grab all the albums from the artist
    var returnedAlbums = await spotifyApi.getArtistAlbums(artistID, {album_type : 'album', country : 'US', limit : 50})
      .then(data => {
        console.log(data.body);
        return data.body; 
    })

    res.status(200).send(returnedAlbums);
        
  });

  
  // ORIGINAL CODE (incase fixes above sucks)

  // app.get('/callback', function(req, res) {
  //   const error = req.query.error;
  //   const code = req.query.code || null
  //   const state = req.query.state;

  //   let authOptions = {
  //     url: 'https://accounts.spotify.com/api/tokens',
  //     form: {
  //       code: code,
  //       redirect_uri: 'htt[://localhost:8888/callback',
  //       grant_type: 'authorization_code'
  //     },
  //     headers: {
  //       'Authorization' : 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
  //     },
  //     json: true
  //   }
  //     request.post(authOptions, function(error, response, body) {
  //       var access_token = body.access_token
  //       let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
  //       res.redirect(uri + '?access_token=' + access_token)
  //     })
    
    
  //   if (error) {
  //     console.error('Callback Error:', error);
  //     // res.send(`Callback Error: ${error}`);
  //     return;
  //   } 
  //   spotifyApi
  //     .authorizationCodeGrant(code)
  //     .then(data => {
  //       const access_token = data.body['access_token'];
  //       const refresh_token = data.body['refresh_token'];
  //       const expires_in = data.body['expires_in'];
  
  //       spotifyApi.setAccessToken(access_token);
  //       spotifyApi.setRefreshToken(refresh_token);
  
  //       console.log('access_token:', access_token);
  //       console.log('refresh_token:', refresh_token);
  
  //       console.log(
  //         `Sucessfully retreived access token. Expires in ${expires_in} s.`
  //       );

  //       res.send(access_token);
  
  //       setInterval(async () => {
  //         const data = await spotifyApi.refreshAccessToken();
  //         const access_token = data.body['access_token'];
  
  //         console.log('The access token has been refreshed!');
  //         console.log('access_token:', access_token);
  //         spotifyApi.setAccessToken(access_token);
  //       }, expires_in / 2 * 1000);
  //     })
  //     .catch(error => {
  //       console.error('Error getting Tokens:', error);
  //       res.send(`Error getting Tokens: ${error}`);
  //     });
  // });



///////////////////////

// Version from Tutorial that can take access token from Spotify Login

// const app = express();

// let redirect_uri = 
//   process.env.REDIRECT_URI || 
//   'http://localhost:8888/callback'

// app.get('/login', function(req, res) {
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: process.env.CLIENT_ID,
//       scope: 'user-read-private user-read-email',
//       redirect_uri
//     }))
// })

// app.get('/callback', function(req, res) {
//   let code = req.query.code || null
//   let authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (new Buffer(
//         process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
//       ).toString('base64'))
//     },
//     json: true
//   }
//   request.post(authOptions, function(error, response, body) {
//     var access_token = body.access_token
//     let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
//     res.redirect(uri + '?access_token=' + access_token)
//   })
// })

// let port = process.env.PORT || 8888
// console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
// app.listen(port)