const pool = require('../config/database');

class Role {
    static async findByUserId(userId) {
        const sql = `SELECT * FROM roles WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    }

    static async findById(id, userId) {
        const sql = `SELECT * FROM roles WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rows[0];
    }

    static async create(userId, name, description) {
        const sql = `INSERT INTO roles (user_id, name, description)
                     VALUES ($1, $2, $3)
                     RETURNING id, name, description, created_at`;
        const result = await pool.query(sql, [userId, name, description || '']);
        return result.rows[0];
    }

    static async update(id, userId, name, description) {
        const sql = `UPDATE roles
                     SET name = $1, description = $2
                     WHERE id = $3 AND user_id = $4
                     RETURNING *`;
        const result = await pool.query(sql, [name, description, id, userId]);
        return result.rows[0];
    }

    static async delete(id, userId) {
        const sql = `DELETE FROM roles WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = Role;
