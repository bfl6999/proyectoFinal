const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// Crear una nueva playlist
router.post('/', async (req, res) => {
    try {
        const newPlaylist = new Playlist(req.body);
        await newPlaylist.save();
        res.status(201).send(newPlaylist);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Leer todas las playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.send(playlists);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Leer una playlist por ID
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).send();
        res.send(playlist);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Actualizar una playlist por ID
router.put('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!playlist) return res.status(404).send();
        res.send(playlist);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar una playlist por ID
router.delete('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id);
        if (!playlist) return res.status(404).send();
        res.send(playlist);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = router;

//Ultima adicion
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => { /*...*/ });
router.put('/:id', auth, async (req, res) => { /*...*/ });
router.delete('/:id', auth, async (req, res) => { /*...*/ });
