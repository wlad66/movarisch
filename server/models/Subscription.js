const pool = require('../config/database');

class Subscription {
    /**
     * Crea una nuova subscription (trial o paid)
     */
    static async create({ userId, status, trialStartDate, trialEndDate, subscriptionStartDate, subscriptionEndDate, paymentMethod, amount, currency, autoRenew, stripeSubscriptionId }) {
        const sql = `
            INSERT INTO subscriptions (
                user_id, status, trial_start_date, trial_end_date,
                subscription_start_date, subscription_end_date,
                payment_method, amount, currency, auto_renew, stripe_subscription_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

        const result = await pool.query(sql, [
            userId,
            status,
            trialStartDate,
            trialEndDate,
            subscriptionStartDate,
            subscriptionEndDate,
            paymentMethod,
            amount,
            currency,
            autoRenew,
            stripeSubscriptionId
        ]);

        return result.rows[0];
    }

    /**
     * Trova subscription per user ID
     */
    static async findByUserId(userId) {
        const sql = `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`;
        const result = await pool.query(sql, [userId]);
        return result.rows[0];
    }

    /**
     * Trova subscription per Stripe subscription ID
     */
    static async findByStripeId(stripeSubscriptionId) {
        const sql = `SELECT * FROM subscriptions WHERE stripe_subscription_id = $1`;
        const result = await pool.query(sql, [stripeSubscriptionId]);
        return result.rows[0];
    }

    /**
     * Aggiorna lo status della subscription
     */
    static async updateStatus(id, status) {
        const sql = `
            UPDATE subscriptions
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(sql, [status, id]);
        return result.rows[0];
    }

    /**
     * Aggiorna subscription con dati pagamento
     */
    static async updateWithPayment(id, { subscriptionStartDate, subscriptionEndDate, status, stripeSubscriptionId, autoRenew }) {
        const sql = `
            UPDATE subscriptions
            SET subscription_start_date = $1,
                subscription_end_date = $2,
                status = $3,
                stripe_subscription_id = $4,
                auto_renew = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
        const result = await pool.query(sql, [
            subscriptionStartDate,
            subscriptionEndDate,
            status,
            stripeSubscriptionId,
            autoRenew,
            id
        ]);
        return result.rows[0];
    }

    /**
     * Trova tutte le subscription scadute
     */
    static async findExpired() {
        const sql = `
            SELECT s.*, u.email, u.nome, u.cognome
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            WHERE (s.status = 'trial' AND s.trial_end_date < CURRENT_TIMESTAMP)
               OR (s.status = 'active' AND s.subscription_end_date < CURRENT_TIMESTAMP)
        `;
        const result = await pool.query(sql);
        return result.rows;
    }

    /**
     * Trova subscription in scadenza (per reminder email)
     */
    static async findExpiringSoon(days = 3) {
        const sql = `
            SELECT s.*, u.email, u.nome, u.cognome
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            WHERE (s.status = 'trial' AND s.trial_end_date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '${days} days')
               OR (s.status = 'active' AND s.subscription_end_date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '${days} days')
        `;
        const result = await pool.query(sql);
        return result.rows;
    }

    /**
     * Verifica se user ha subscription attiva
     */
    static async isActive(userId) {
        const subscription = await this.findByUserId(userId);
        if (!subscription) return false;

        const now = new Date();

        if (subscription.status === 'trial') {
            return new Date(subscription.trial_end_date) > now;
        }

        if (subscription.status === 'active') {
            return new Date(subscription.subscription_end_date) > now;
        }

        return false;
    }

    /**
     * Ottieni giorni rimanenti
     */
    static async getDaysRemaining(userId) {
        const subscription = await this.findByUserId(userId);
        if (!subscription) return 0;

        const now = new Date();
        let endDate;

        if (subscription.status === 'trial') {
            endDate = new Date(subscription.trial_end_date);
        } else if (subscription.status === 'active') {
            endDate = new Date(subscription.subscription_end_date);
        } else {
            return 0;
        }

        const diffTime = endDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }
}

module.exports = Subscription;
