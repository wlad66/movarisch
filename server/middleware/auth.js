const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'movarisch-secret-key-change-this-in-prod';

/**
 * Middleware per verificare il JWT token
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 verifyToken called for:', req.method, req.path);
    console.log('🔐 Auth header present:', !!authHeader);

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('❌ Token verification failed:', err.message);
            console.log('❌ Token was:', token.substring(0, 20) + '...');
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.log('✅ Token verified for user:', user.id);
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
