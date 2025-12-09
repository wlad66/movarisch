const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const User = require('../models/User');
const emailService = require('../services/email.service');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * GET /api/subscription/status
 * Ottieni lo stato dell'abbonamento dell'utente
 */
async function getStatus(req, res) {
    try {
        const userId = req.user.id;

        const subscription = await Subscription.findByUserId(userId);

        if (!subscription) {
            return res.json({
                status: 'none',
                active: false,
                expired: true,
                trial: null,
                subscription: null
            });
        }

        const now = new Date();
        const isActive = await Subscription.isActive(userId);
        const daysRemaining = await Subscription.getDaysRemaining(userId);

        let endDate;
        if (subscription.status === 'trial') {
            endDate = subscription.trial_end_date;
        } else if (subscription.status === 'active') {
            endDate = subscription.subscription_end_date;
        }

        // Return data in format expected by frontend
        const response = {
            status: subscription.status,
            active: isActive,
            expired: !isActive
        };

        // Add trial object if in trial
        if (subscription.status === 'trial') {
            response.trial = {
                active: isActive,
                daysRemaining,
                endsAt: endDate
            };
        }

        // Add subscription object if active subscription
        if (subscription.status === 'active') {
            response.subscription = {
                status: 'active',
                daysRemaining,
                endsAt: endDate,
                startsAt: subscription.subscription_start_date,
                autoRenew: subscription.auto_renew || false
            };
        }

        res.json(response);
    } catch (error) {
        console.error('Get subscription status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /api/subscription/create-checkout
 * Crea sessione Stripe Checkout
 */
async function createCheckout(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verifica se esiste già un abbonamento attivo
        const existingSubscription = await Subscription.findByUserId(userId);
        const isActive = existingSubscription ? await Subscription.isActive(userId) : false;

        if (isActive && existingSubscription.status === 'active') {
            return res.status(400).json({ error: 'You already have an active subscription' });
        }

        // Crea sessione Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'payment', // Pagamento one-time (non ricorrente)
            success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            customer_email: user.email,
            client_reference_id: userId.toString(),
            metadata: {
                userId: userId.toString(),
                email: user.email,
                subscriptionType: 'annual'
            }
        });

        res.json({
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Create checkout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * POST /api/subscription/webhook
 * Gestisce webhook Stripe
 */
async function webhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gestisci l'evento
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'payment_intent.succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
}

/**
 * Gestisce completamento checkout Stripe
 */
async function handleCheckoutCompleted(session) {
    const userId = parseInt(session.client_reference_id);
    const paymentIntentId = session.payment_intent;
    const amountTotal = session.amount_total / 100; // Stripe usa cents

    console.log('Checkout completed for user:', userId);

    // Trova o crea subscription
    let subscription = await Subscription.findByUserId(userId);

    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    if (subscription) {
        // Aggiorna subscription esistente (da trial a active)
        subscription = await Subscription.updateWithPayment(subscription.id, {
            subscriptionStartDate: now,
            subscriptionEndDate: oneYearLater,
            status: 'active',
            stripeSubscriptionId: session.subscription || null,
            autoRenew: false
        });
    } else {
        // Crea nuova subscription
        subscription = await Subscription.create({
            userId,
            status: 'active',
            trialStartDate: null,
            trialEndDate: null,
            subscriptionStartDate: now,
            subscriptionEndDate: oneYearLater,
            paymentMethod: 'stripe',
            amount: amountTotal,
            currency: session.currency.toUpperCase(),
            autoRenew: false,
            stripeSubscriptionId: session.subscription || null
        });
    }

    // Aggiorna user subscription status
    const pool = require('../config/database');
    await pool.query(
        `UPDATE users SET subscription_status = $1, subscription_ends_at = $2 WHERE id = $3`,
        ['active', oneYearLater, userId]
    );

    // Crea record pagamento
    await Payment.create({
        userId,
        subscriptionId: subscription.id,
        amount: amountTotal,
        currency: session.currency.toUpperCase(),
        paymentProvider: 'stripe',
        paymentId: session.id,
        stripePaymentIntentId: paymentIntentId,
        status: 'completed',
        paymentDate: now
    });

    // Invia email conferma
    const user = await User.findById(userId);
    if (user) {
        await emailService.sendPaymentConfirmationEmail(
            user.email,
            user.nome,
            amountTotal,
            oneYearLater
        );
    }

    console.log('Subscription activated for user:', userId);
}

/**
 * Gestisce pagamento riuscito
 */
async function handlePaymentSucceeded(paymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Aggiorna status pagamento se esiste
    const payment = await Payment.findByStripePaymentIntentId(paymentIntent.id);
    if (payment) {
        await Payment.updateStatus(payment.id, 'completed');
    }
}

/**
 * Gestisce pagamento fallito
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    const payment = await Payment.findByStripePaymentIntentId(paymentIntent.id);
    if (payment) {
        await Payment.updateStatus(payment.id, 'failed');
    }
}

/**
 * POST /api/subscription/cancel
 * Cancella abbonamento
 */
async function cancel(req, res) {
    try {
        const userId = req.user.id;

        const subscription = await Subscription.findByUserId(userId);
        if (!subscription) {
            return res.status(404).json({ error: 'No subscription found' });
        }

        // Aggiorna status a cancelled
        await Subscription.updateStatus(subscription.id, 'cancelled');

        // Se c'è un subscription ID Stripe, cancellalo
        if (subscription.stripe_subscription_id) {
            try {
                await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
            } catch (error) {
                console.error('Error cancelling Stripe subscription:', error);
            }
        }

        res.json({ message: 'Subscription cancelled successfully' });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

/**
 * GET /api/subscription/history
 * Ottieni storico pagamenti
 */
async function getHistory(req, res) {
    try {
        const userId = req.user.id;

        const payments = await Payment.findByUserId(userId);

        res.json({ payments });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    getStatus,
    createCheckout,
    webhook,
    cancel,
    getHistory
};
