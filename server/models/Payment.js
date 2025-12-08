const pool = require('../config/database');

class Payment {
    /**
     * Crea un nuovo pagamento
     */
    static async create({ userId, subscriptionId, amount, currency, paymentProvider, paymentId, stripePaymentIntentId, status, paymentDate }) {
        const sql = `
            INSERT INTO payments (
                user_id, subscription_id, amount, currency,
                payment_provider, payment_id, stripe_payment_intent_id,
                status, payment_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const result = await pool.query(sql, [
            userId,
            subscriptionId,
            amount,
            currency,
            paymentProvider,
            paymentId,
            stripePaymentIntentId,
            status,
            paymentDate
        ]);

        return result.rows[0];
    }

    /**
     * Trova pagamento per ID
     */
    static async findById(id) {
        const sql = `SELECT * FROM payments WHERE id = $1`;
        const result = await pool.query(sql, [id]);
        return result.rows[0];
    }

    /**
     * Trova tutti i pagamenti di un utente
     */
    static async findByUserId(userId) {
        const sql = `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`;
        const result = await pool.query(sql, [userId]);
        return result.rows;
    }

    /**
     * Trova pagamento per Stripe Payment Intent ID
     */
    static async findByStripePaymentIntentId(stripePaymentIntentId) {
        const sql = `SELECT * FROM payments WHERE stripe_payment_intent_id = $1`;
        const result = await pool.query(sql, [stripePaymentIntentId]);
        return result.rows[0];
    }

    /**
     * Aggiorna status pagamento
     */
    static async updateStatus(id, status) {
        const sql = `
            UPDATE payments
            SET status = $1
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(sql, [status, id]);
        return result.rows[0];
    }

    /**
     * Trova ultimo pagamento completato per utente
     */
    static async findLastCompletedByUserId(userId) {
        const sql = `
            SELECT * FROM payments
            WHERE user_id = $1 AND status = 'completed'
            ORDER BY payment_date DESC
            LIMIT 1
        `;
        const result = await pool.query(sql, [userId]);
        return result.rows[0];
    }

    /**
     * Calcola totale pagato da utente
     */
    static async getTotalPaidByUserId(userId) {
        const sql = `
            SELECT SUM(amount) as total
            FROM payments
            WHERE user_id = $1 AND status = 'completed'
        `;
        const result = await pool.query(sql, [userId]);
        return parseFloat(result.rows[0].total || 0);
    }

    /**
     * Statistiche pagamenti (admin)
     */
    static async getStats() {
        const sql = `
            SELECT
                COUNT(*) as total_payments,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
                SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
                AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_payment
            FROM payments
        `;
        const result = await pool.query(sql);
        return result.rows[0];
    }
}

module.exports = Payment;
