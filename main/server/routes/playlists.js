const express = require('express');

const {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    deletePlaylist,
    updatePlaylist
    } = require('../controllers/playlistController')

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

router.use(requireAuth)
// GET all playlist
router.get('/', getPlaylists)

//GET a single playlists
router.get('/:id', getPlaylist)

// POST a new playlist
router.post('/', createPlaylist)

// DELETE a new playlist
router.delete('/:id', deletePlaylist)
// UPDATE a new playlist
router.patch('/:id', updatePlaylist)

module.exports = router