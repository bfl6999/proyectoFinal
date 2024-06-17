const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    name: String,
    artists: [String],
    album: String,
    released: Date,
    duration: Number,
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Track', trackSchema);
