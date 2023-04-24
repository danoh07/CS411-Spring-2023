const mongoose = require('mongoose')

const Schema = mongoose.Schema

const playlistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    songs: {
        type: Array,
        required: true
    },
    load: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
    
}, { timestamps: true })

module.exports = mongoose.model('Playlist', playlistSchema)