const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
    try {
        const { email, password, nome, cognome, azienda, piva, companyData, legalData } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate legal acceptance
        if (!legalData || !legalData.termsAccepted || !legalData.privacyAccepted ||
            !legalData.disclaimerAccepted || !legalData.professionalConfirmed) {
            return res.status(400).json({ error: 'Legal documents must be accepted' });
        }

        // Check if user exists
        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user with legal data
        const user = await User.create({
            email,
            password,
            nome,
            cognome,
            azienda,
            piva,
            companyData,
            legalData
        });

        const token = generateToken(user);

        res.json({
            token,
            user: User.formatUser(user),
            company: companyData || {}
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const match = await User.verifyPassword(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: User.formatUser(user),
            company: user.company_data || {}
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: User.formatUser(user),
            company: user.company_data || {}
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { register, login, me };
