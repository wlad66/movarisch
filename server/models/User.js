const pool = require('../config/database');
const bcrypt = require('bcryptjs');

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
        try {
            console.log('User.create: hashing password');
            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `INSERT INTO users (
                email, password, nome, cognome, azienda, piva, company_data, legal_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, email, nome, cognome, azienda, piva, company_data, legal_data`;

            console.log('User.create: executing INSERT query');
            const result = await pool.query(sql, [
                email,
                hashedPassword,
                nome,
                cognome,
                azienda,
                piva,
                companyData || {},
                legalData || {}
            ]);

            console.log('User.create: user inserted successfully');
            return result.rows[0];
        } catch (error) {
            console.error('User.create ERROR:', error.message, error.stack);
            throw error;
        }
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = `UPDATE users SET password = $1 WHERE id = $2`;
        await pool.query(sql, [hashedPassword, userId]);
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
