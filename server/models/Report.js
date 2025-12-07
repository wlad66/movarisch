const pool = require('../config/database');

class Report {
    static async findByUserId(userId) {
        const sql = `SELECT * FROM reports WHERE user_id = $1 ORDER BY id DESC`;
        const result = await pool.query(sql, [userId]);

        return result.rows.map(row => ({
            id: row.id,
            date: row.date,
            ...row.data
        }));
    }

    static async findById(id, userId) {
        const sql = `SELECT * FROM reports WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            date: row.date,
            ...row.data
        };
    }

    static async create(userId, reportData) {
        const date = reportData.date || new Date().toISOString();
        const sql = `INSERT INTO reports (user_id, date, data)
                     VALUES ($1, $2, $3)
                     RETURNING id`;

        const result = await pool.query(sql, [userId, date, reportData]);
        return {
            id: result.rows[0].id,
            ...reportData
        };
    }

    static async delete(id, userId) {
        const sql = `DELETE FROM reports WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = Report;
