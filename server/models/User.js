const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = $1`;
        const result = await pool.query(sql, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const sql = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    }

    static async create({ email, password, nome, cognome, azienda, piva, companyData, legalData }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const now = new Date();

        const sql = `INSERT INTO users (
            email, password, nome, cognome, azienda, piva, company_data,
            terms_accepted, terms_accepted_at,
            privacy_accepted, privacy_accepted_at,
            disclaimer_accepted, disclaimer_accepted_at,
            professional_confirmed, legal_version
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id, email, nome, cognome, azienda`;

        const result = await pool.query(sql, [
            email,
            hashedPassword,
            nome,
            cognome,
            azienda,
            piva,
            companyData || {},
            legalData?.termsAccepted || false,
            legalData?.termsAccepted ? now : null,
            legalData?.privacyAccepted || false,
            legalData?.privacyAccepted ? now : null,
            legalData?.disclaimerAccepted || false,
            legalData?.disclaimerAccepted ? now : null,
            legalData?.professionalConfirmed || false,
            '1.0'
        ]);

        return result.rows[0];
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    static formatUser(user) {
        return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            cognome: user.cognome,
            azienda: user.azienda
        };
    }

    static formatUserWithCompany(user) {
        return {
            user: this.formatUser(user),
            company: user.company_data || {}
        };
    }
}

module.exports = User;
