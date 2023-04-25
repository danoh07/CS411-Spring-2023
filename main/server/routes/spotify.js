const express = require('express')
const { 
    callback,
    logOut,
    getAuthUrl, 
    getMe, 
    getPlaylist,
    searchTrack,
    createPlaylist,
    addTrackstoPlaylist } = require('../controllers/spotifyAPIController')

const router = express.Router()

router.get('/callback', callback);

router.get('/getAuthUrl', getAuthUrl);

router.get('/get/playlist', getMe, getPlaylist)

router.get('/search/track/:searchParam', searchTrack)

router.post('/create/playlist', createPlaylist)

router.post('/add/playlist/tracks', addTrackstoPlaylist)

router.get('/logout', logOut)

module.exports = router