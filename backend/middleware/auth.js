const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        console.log('Token received:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded user:', decoded);
        req.user = decoded;
        next();
    } catch (ex) {
        console.error('Error verifying token:', ex);
        res.status(400).send('Invalid token.');
    }
};
