const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: String,
    comment: {
        type: String,
        maxlength: 1000
    },
    stars: {
        type: Number,
        min: 0,
        max: 5
    },
    track: { type: mongoose.Schema.Types.ObjectId, ref: 'Track' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
