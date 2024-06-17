const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
    name: String,
    artists: [String],
    album: String,
    released: Date,
    duration: Number
});

const PlaylistSchema = new mongoose.Schema({
    name: String,
    description: String,
    tracks: [TrackSchema]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
