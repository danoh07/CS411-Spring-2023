const express = require('express')
const { 
    getMyPlaylist,
    search,
    createPlaylist,
    updatePlaylist,
    logout } = require('../controllers/youtubeAPIController')
const requireAuth = require('../middleware/requireAuth');

const router = express.Router()

router.use(requireAuth)

router.get('/myPlaylist', getMyPlaylist)

router.get('/search/:searchParam', search)

router.post('/create/playlist', createPlaylist)

router.post('/update/playlist', updatePlaylist)

router.get('/logout', logout)

module.exports = router