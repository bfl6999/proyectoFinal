const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tracks = await Track.find();
        res.json(tracks);
    } catch (err) {
        console.error('Error fetching tracks:', err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { name, artists, album, released, duration, imageUrl } = req.body;
        const newTrack = new Track({
            name,
            artists,
            album,
            released,
            duration,
            imageUrl,
            user: req.user._id
        });
        const savedTrack = await newTrack.save();
        res.json(savedTrack);
    } catch (err) {
        console.error('Error saving track:', err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
});

// Ruta para cargar pistas desde Spotify
router.get('/load-tracks', async (req, res) => {
    try {
        const token = await getSpotifyToken();
        const tracks = await loadTracksFromSpotify(req.query.q, token);
        res.json(tracks);
    } catch (error) {
        console.error('Error loading tracks from Spotify:', error); // Log the error for debugging
        res.status(500).send('Error loading tracks');
    }
});

async function getSpotifyToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
        },
        params: {
            grant_type: 'client_credentials'
        }
    });
    return response.data.access_token;
}

async function loadTracksFromSpotify(query, token) {
    const options = {
        url: `https://api.spotify.com/v1/search`,
        method: 'GET',
        params: {
            q: query,
            type: 'track',
            limit: 10
        },
        headers: { 'Authorization': 'Bearer ' + token }
    };

    try {
        const response = await axios(options);
        const tracks = response.data.tracks.items.map(item => ({
            name: item.name,
            artists: item.artists.map(artist => artist.name),
            album: item.album.name,
            released: item.album.release_date,
            duration: item.duration_ms,
            imageUrl: item.album.images[0]?.url || '',
        }));

        return tracks;
    } catch (error) {
        console.error('Error loading tracks from Spotify', error);
        throw error;
    }
}

module.exports = router;
