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

    static async create({ email, password, nome, cognome, azienda, piva, companyData }) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO users (email, password, nome, cognome, azienda, piva, company_data)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING id, email, nome, cognome, azienda`;

        const result = await pool.query(sql, [
            email,
            hashedPassword,
            nome,
            cognome,
            azienda,
            piva,
            companyData || {}
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
