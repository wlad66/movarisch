const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const subscriptionController = require('../controllers/subscription.controller');

// GET /api/subscription/status - Get subscription status
router.get('/status', verifyToken, subscriptionController.getStatus);

// POST /api/subscription/create-checkout - Create Stripe checkout session
router.post('/create-checkout', verifyToken, subscriptionController.createCheckout);

// POST /api/subscription/webhook - Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), subscriptionController.webhook);

// POST /api/subscription/cancel - Cancel subscription
router.post('/cancel', verifyToken, subscriptionController.cancel);

// GET /api/subscription/history - Payment history
router.get('/history', verifyToken, subscriptionController.getHistory);

module.exports = router;
