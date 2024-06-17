const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).send('User already exists.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.header('Authorization', token).send({ _id: user._id, username: user.username });
    } catch (error) {
        console.error('Register error:', error); // Log the error for debugging
        res.status(500).send('Server error.');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.header('Authorization', token).send({ _id: user._id, username: user.username });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).send('Server error.');
    }
});

module.exports = router;
