const pool = require('../config/database');

class Workplace {
    /**
     * Trova tutti i luoghi di lavoro per un utente
     */
    static async findByUserId(userId) {
        const sql = `SELECT * FROM workplaces WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    }

    /**
     * Trova un luogo di lavoro specifico
     */
    static async findById(id, userId) {
        const sql = `SELECT * FROM workplaces WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rows[0];
    }

    /**
     * Crea un nuovo luogo di lavoro
     */
    static async create(userId, name) {
        const sql = `INSERT INTO workplaces (user_id, name)
                     VALUES ($1, $2)
                     RETURNING id, name, created_at`;
        const result = await pool.query(sql, [userId, name]);
        return result.rows[0];
    }

    /**
     * Aggiorna un luogo di lavoro
     */
    static async update(id, userId, name) {
        const sql = `UPDATE workplaces
                     SET name = $1
                     WHERE id = $2 AND user_id = $3
                     RETURNING *`;
        const result = await pool.query(sql, [name, id, userId]);
        return result.rows[0];
    }

    /**
     * Elimina un luogo di lavoro
     */
    static async delete(id, userId) {
        const sql = `DELETE FROM workplaces WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = Workplace;
