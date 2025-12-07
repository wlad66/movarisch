const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'movarisch-secret-key-change-this-in-prod';

/**
 * Middleware per verificare il JWT token
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

/**
 * Genera un JWT token per un utente
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
}

module.exports = { verifyToken, generateToken };
