const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PasswordResetToken {
    /**
     * Crea un nuovo token per reset password
     */
    static async create(userId, expiresInHours = 1) {
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiresInHours);

        const sql = `
            INSERT INTO password_reset_tokens (user_id, token, expires_at)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query(sql, [userId, token, expiresAt]);
        return result.rows[0];
    }

    /**
     * Trova token valido
     */
    static async findValidToken(token) {
        const sql = `
            SELECT * FROM password_reset_tokens
            WHERE token = $1
              AND used = false
              AND expires_at > CURRENT_TIMESTAMP
        `;
        const result = await pool.query(sql, [token]);
        return result.rows[0];
    }

    /**
     * Marca token come usato
     */
    static async markAsUsed(token) {
        const sql = `
            UPDATE password_reset_tokens
            SET used = true
            WHERE token = $1
            RETURNING *
        `;
        const result = await pool.query(sql, [token]);
        return result.rows[0];
    }

    /**
     * Invalida tutti i token di un utente
     */
    static async invalidateAllForUser(userId) {
        const sql = `
            UPDATE password_reset_tokens
            SET used = true
            WHERE user_id = $1 AND used = false
        `;
        await pool.query(sql, [userId]);
    }

    /**
     * Pulizia token scaduti (da eseguire periodicamente)
     */
    static async cleanupExpired() {
        const sql = `
            DELETE FROM password_reset_tokens
            WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '7 days'
        `;
        const result = await pool.query(sql);
        return result.rowCount;
    }

    /**
     * Conta tentativi recenti per email (rate limiting)
     */
    static async countRecentAttempts(userId, minutesAgo = 60) {
        const sql = `
            SELECT COUNT(*) as count
            FROM password_reset_tokens
            WHERE user_id = $1
              AND created_at > CURRENT_TIMESTAMP - INTERVAL '${minutesAgo} minutes'
        `;
        const result = await pool.query(sql, [userId]);
        return parseInt(result.rows[0].count);
    }
}

module.exports = PasswordResetToken;
