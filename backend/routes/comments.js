const express = require('express');
const Comment = require('../models/Comment');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/:trackId', auth, async (req, res) => {
    try {
        const { trackId } = req.params;
        const { author, comment, stars } = req.body;

        const newComment = new Comment({
            author,
            comment,
            stars,
            track: trackId,
            user: req.user._id
        });

        const savedComment = await newComment.save();
        res.json(savedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:commentId', auth, async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        if (comment.user.toString() !== req.user._id) return res.status(401).json({ error: 'Unauthorized' });

        await comment.remove();
        res.json({ message: 'Comment removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
