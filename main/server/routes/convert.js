const express = require('express')
const { convertSpotifyPlaylistToYoutube, convertYoutubePlaylistToSpotify} = require('../controllers/playlistConverter')

const router = express.Router()

const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth)

router.get('/spotify/playlist/youtube/:spotifyPlaylistId', convertSpotifyPlaylistToYoutube)

router.get('/youtube/playlist/spotify/:youtubePlaylistId', convertYoutubePlaylistToSpotify)

module.exports = router