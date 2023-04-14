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
    }
}, { timeseries: true })

module.exports = mongoose.model('Playlist', playlistSchema)