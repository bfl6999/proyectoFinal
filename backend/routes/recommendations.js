const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userTracks = await Track.find({ user: req.user._id });

        // Aquí debería ir tu lógica para obtener recomendaciones basadas en las canciones del usuario
        const recommendations = userTracks.slice(0, 5); // Placeholder

        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
