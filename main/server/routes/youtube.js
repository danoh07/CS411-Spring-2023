const express = require('express')
const { 
    getMyPlaylist,
    search,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    logout } = require('../controllers/youtubeAPIController')
const requireAuth = require('../middleware/requireAuth');

const { getPlaylistItems } = require('../controllers/youtubeAPIController');

const router = express.Router()

router.use(requireAuth)

router.get('/playlistItems/:playlistId', getPlaylistItems);

router.get('/myPlaylist', getMyPlaylist)

router.get('/search/:searchParam', search)

router.post('/create/playlist', createPlaylist)

router.post('/update/playlist', updatePlaylist)

router.delete('/delete/playlist/:playlistId', deletePlaylist)

router.get('/logout', logout)

module.exports = router