const pool = require('../config/database');

class Inventory {
    static async findByUserId(userId) {
        const sql = `SELECT * FROM inventory WHERE user_id = $1 ORDER BY id ASC`;
        const result = await pool.query(sql, [userId]);

        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            cas: row.cas,
            hCodes: typeof row.hcodes === 'string' ? JSON.parse(row.hcodes) : (row.hcodes || []),
            riskLevel: row.risklevel,
            ...(row.additionaldata || {})
        }));
    }

    static async findByCAS(userId, cas) {
        const sql = `SELECT id FROM inventory WHERE user_id = $1 AND cas = $2`;
        const result = await pool.query(sql, [userId, cas]);
        return result.rows[0];
    }

    static async create(userId, { name, cas, hCodes, riskLevel, additionalData }) {
        const sql = `INSERT INTO inventory (user_id, name, cas, hCodes, riskLevel, additionalData)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     RETURNING *`;

        const result = await pool.query(sql, [
            userId,
            name,
            cas,
            hCodes || [],
            riskLevel || 0,
            additionalData || {}
        ]);

        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            cas: row.cas,
            hCodes: typeof row.hcodes === 'string' ? JSON.parse(row.hcodes) : (row.hcodes || []),
            riskLevel: row.risklevel,
            ...(row.additionaldata || {})
        };
    }

    static async update(id, userId, { name, cas, hCodes, riskLevel, additionalData }) {
        const sql = `UPDATE inventory
                     SET name = $1, cas = $2, hCodes = $3, riskLevel = $4, additionalData = $5
                     WHERE id = $6 AND user_id = $7
                     RETURNING *`;

        const result = await pool.query(sql, [
            name,
            cas,
            hCodes || [],
            riskLevel || 0,
            additionalData || {},
            id,
            userId
        ]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            cas: row.cas,
            hCodes: typeof row.hcodes === 'string' ? JSON.parse(row.hcodes) : (row.hcodes || []),
            riskLevel: row.risklevel,
            ...(row.additionaldata || {})
        };
    }

    static async delete(id, userId) {
        const sql = `DELETE FROM inventory WHERE id = $1 AND user_id = $2`;
        const result = await pool.query(sql, [id, userId]);
        return result.rowCount > 0;
    }
}

module.exports = Inventory;
