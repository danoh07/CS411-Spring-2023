const Playlist = require('../models/playlistModel')
const mongoose = require('mongoose')
// get all playlists
const getPlaylists = async (req, res) => {
    const user_id = req.user._id

    const playlists = await Playlist.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(playlists)
}
// get a single playlist
const getPlaylist = async (req, res) => {
    const { id } = req.params 

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such playlist'})
    }

    const playlist = await Playlist.findById(id)
    
    if (!playlist) {
        return res.status(404).json({error: 'No such playlist'})
    }

    res.status(200).json(playlist)
}

// create a new playlist
const createPlaylist = async(req, res) => {
    const {title, songs, load} = req.body

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }
    if(!songs) {
        emptyFields.push('songs')
    }
    if(emptyFields.length > 0) {
        res.status(400).json({ error: 'Please fill all the fields', emptyFields})
    }

    
    // add doc to db
    try {
        const user_id = req.user._id
        const playlist = await Playlist.create({title, songs, load, user_id})
        res.status(200).json(playlist)
    } catch (error) {
        res.status(400).json(error)
    }
}

// delete a playlist
const deletePlaylist = async(req, res) => {
    const { id } = req.params 

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such playlist'})
    }

    const playlist = await Playlist.findOneAndDelete({_id: id})
    
    if (!playlist) {
        return res.status(404).json({error: 'No such playlist'})
    }

    res.status(200).json(playlist)
}
// update a playlist
const updatePlaylist = async(req, res) => {
    const { id } = req.params 

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such playlist'})
    }

    const playlist = await Playlist.findOneAndUpdate({_id: id}, {
        ...req.body
    })
    
    if (!playlist) {
        return res.status(404).json({error: 'No such playlist'})
    }

    res.status(200).json(playlist)
}

module.exports = {
    getPlaylists,
    getPlaylist,
    createPlaylist,
    deletePlaylist,
    updatePlaylist
}