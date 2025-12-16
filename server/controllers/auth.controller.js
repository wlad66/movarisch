const User = require('../models/User');
const Subscription = require('../models/Subscription');
const PasswordResetToken = require('../models/PasswordResetToken');
const emailService = require('../services/email.service');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
    try {
        console.log('1. Register start');
        const { email, password, nome, cognome, azienda, piva, companyData, legalData } = req.body;

        console.log('2. Validating input');
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        console.log('3. Validating legal data');
        // Validate legal acceptance
        if (!legalData || !legalData.termsAccepted || !legalData.privacyAccepted ||
            !legalData.disclaimerAccepted || !legalData.professionalConfirmed) {
            return res.status(400).json({ error: 'Legal documents must be accepted' });
        }

        console.log('4. Checking existing user');
        // Check if user exists
        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        console.log('5. Creating user');
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
        console.log('6. User created:', user.id);

        // Auto-attiva trial di 7 giorni
        const trialDays = parseInt(process.env.TRIAL_DAYS) || 7;
        const now = new Date();
        const trialEndDate = new Date(now);
        trialEndDate.setDate(trialEndDate.getDate() + trialDays);

        await Subscription.create({
            userId: user.id,
            status: 'trial',
            trialStartDate: now,
            trialEndDate: trialEndDate,
            subscriptionStartDate: null,
            subscriptionEndDate: null,
            paymentMethod: null,
            amount: null,
            currency: 'EUR',
            autoRenew: false,
            stripeSubscriptionId: null
        });

        // Aggiorna user con trial info
        const pool = require('../config/database');
        await pool.query(
            `UPDATE users SET subscription_status = $1, trial_ends_at = $2 WHERE id = $3`,
            ['trial', trialEndDate, user.id]
        );

        // Invia email benvenuto
        await emailService.sendWelcomeEmail(user.email, user.nome, trialEndDate);

        const token = generateToken(user);

        res.json({
            token,
            user: User.formatUser(user),
            company: companyData || {},
            trial: {
                active: true,
                daysRemaining: trialDays,
                endsAt: trialEndDate
            }
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

        console.log('🔐 Login attempt for:', email);

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const match = await User.verifyPassword(password, user.password);
        if (!match) {
            console.log('❌ Invalid password for:', email);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        console.log('✅ User authenticated:', user.id);

        const token = generateToken(user);

        // Fetch subscription details
        const subscription = await Subscription.findByUserId(user.id);
        console.log('📊 Subscription found:', subscription ? `ID ${subscription.id}, Status: ${subscription.status}` : 'NONE');

        const isActive = await Subscription.isActive(user.id);
        const daysRemaining = await Subscription.getDaysRemaining(user.id);
        console.log('📊 Subscription active:', isActive, 'Days remaining:', daysRemaining);

        let response = {
            token,
            user: User.formatUser(user),
            company: user.company_data || {}
        };

        if (subscription) {
            let endDate;
            if (subscription.status === 'trial') {
                endDate = subscription.trial_end_date;
            } else if (subscription.status === 'active') {
                endDate = subscription.subscription_end_date;
            }

            // Add trial object if in trial
            if (subscription.status === 'trial') {
                response.trial = {
                    active: isActive,
                    daysRemaining,
                    endsAt: endDate
                };
                console.log('✅ Trial data added to response:', response.trial);
            }

            // Add subscription object if active subscription
            if (subscription.status === 'active') {
                response.subscription = {
                    status: 'active',
                    daysRemaining,
                    endsAt: endDate,
                    startsAt: subscription.subscription_start_date,
                    autoRenew: subscription.auto_renew || false
                };
                console.log('✅ Subscription data added to response:', response.subscription);
            }
        } else {
            console.log('⚠️ No subscription found for user:', user.id);
        }

        console.log('📤 Login response:', {
            hasUser: !!response.user,
            hasCompany: !!response.company,
            hasTrial: !!response.trial,
            hasSubscription: !!response.subscription
        });

        res.json(response);
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

/**
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            // Non rivelare se l'email esiste o no (sicurezza)
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Rate limiting: max 3 tentativi all'ora
        const recentAttempts = await PasswordResetToken.countRecentAttempts(user.id, 60);
        if (recentAttempts >= 3) {
            return res.status(429).json({ error: 'Too many reset attempts. Please try again later.' });
        }

        // Crea token reset
        const resetToken = await PasswordResetToken.create(user.id, 1); // 1 ora validità

        // Invia email
        await emailService.sendPasswordResetEmail(user.email, user.nome, resetToken.token);

        res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /api/auth/reset-password/:token
 */
async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Verifica validità token
        const resetToken = await PasswordResetToken.findValidToken(token);
        if (!resetToken) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash nuova password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Aggiorna password utente
        const user = await User.findById(resetToken.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update password
        const sql = `UPDATE users SET password = $1 WHERE id = $2`;
        const pool = require('../config/database');
        await pool.query(sql, [hashedPassword, user.id]);

        // Marca token come usato
        await PasswordResetToken.markAsUsed(token);

        // Invalida tutti gli altri token dell'utente
        await PasswordResetToken.invalidateAllForUser(user.id);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * GET /api/auth/verify-reset-token/:token
 */
async function verifyResetToken(req, res) {
    try {
        const { token } = req.params;

        const resetToken = await PasswordResetToken.findValidToken(token);

        if (!resetToken) {
            return res.status(400).json({ valid: false, error: 'Invalid or expired token' });
        }

        res.json({ valid: true });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { register, login, me, forgotPassword, resetPassword, verifyResetToken };
