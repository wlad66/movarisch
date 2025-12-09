const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendEmail } = require('../services/emailService');
const crypto = require('crypto');

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email richiesta' });
        }

        // Find user
        const user = await User.findByEmail(email);

        // Always return success to avoid email enumeration
        if (!user) {
            return res.json({ message: 'Se l\'email esiste, riceverai un link per il reset' });
        }

        // Check rate limiting
        const recentAttempts = await PasswordResetToken.countRecentAttempts(user.id, 60);
        if (recentAttempts >= 3) {
            return res.status(429).json({ error: 'Troppi tentativi. Riprova tra 1 ora' });
        }

        // Generate reset token
        const resetToken = await PasswordResetToken.create(user.id, 1); // 1 hour
        const token = resetToken.token;

        // Send email
        const resetUrl = `${process.env.APP_URL || 'https://movarisch.safetyprosuite.com'}?token=${token}`;

        await sendEmail({
            to: email,
            subject: 'Reset Password - MoVaRisCh',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #1e40af; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">MoVaRisCh</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f8fafc;">
                        <h2 style="color: #1e293b;">Reset Password</h2>
                        <p style="color: #475569; line-height: 1.6;">
                            Hai richiesto di reimpostare la tua password. Clicca sul pulsante qui sotto per procedere:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                                Reimposta Password
                            </a>
                        </div>
                        <p style="color: #64748b; font-size: 14px;">
                            Questo link scadrà tra 1 ora.
                        </p>
                        <p style="color: #64748b; font-size: 14px;">
                            Se non hai richiesto il reset della password, ignora questa email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            Hai bisogno di aiuto? Contattaci a info@safetyprosuite.com
                        </p>
                    </div>
                </div>
            `
        });

        res.json({ message: 'Se l\'email esiste, riceverai un link per il reset' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Errore durante la richiesta di reset' });
    }
}

async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token e password richiesti' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'La password deve essere di almeno 8 caratteri' });
        }

        // Find and validate token
        const resetToken = await PasswordResetToken.findValidToken(token);

        if (!resetToken) {
            return res.status(400).json({ error: 'Token non valido o scaduto' });
        }

        // Update user password
        await User.updatePassword(resetToken.user_id, password);

        // Mark token as used
        await PasswordResetToken.markAsUsed(token);

        // Send confirmation email
        const user = await User.findById(resetToken.user_id);
        await sendEmail({
            to: user.email,
            subject: 'Password Reimpostata - MoVaRisCh',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #1e40af; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">MoVaRisCh</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f8fafc;">
                        <h2 style="color: #1e293b;">Password Reimpostata</h2>
                        <p style="color: #475569; line-height: 1.6;">
                            La tua password è stata reimpostata con successo.
                        </p>
                        <p style="color: #475569; line-height: 1.6;">
                            Se non hai effettuato tu questa operazione, contattaci immediatamente a info@safetyprosuite.com
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            MoVaRisCh - Safety Pro Suite
                        </p>
                    </div>
                </div>
            `
        });

        res.json({ message: 'Password reimpostata con successo' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Errore durante il reset della password' });
    }
}

module.exports = {
    forgotPassword,
    resetPassword
};
