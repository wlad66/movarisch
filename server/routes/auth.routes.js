const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me - Validate token and get user info
router.get('/me', verifyToken, authController.me);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token - Reset password with token
router.post('/reset-password/:token', authController.resetPassword);

// GET /api/auth/verify-reset-token/:token - Verify token validity
router.get('/verify-reset-token/:token', authController.verifyResetToken);

module.exports = router;
