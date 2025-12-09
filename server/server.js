const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database config (initializes schema)
require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const workplacesRoutes = require('./routes/workplaces.routes');
const rolesRoutes = require('./routes/roles.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist folder with proper cache headers
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
    maxAge: '1y', // Cache assets for 1 year (they have hash in filename)
    immutable: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/workplaces', workplacesRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'MoVaRisCh API is running' });
});

// Serve index.html for all other routes (SPA fallback) with AGGRESSIVE no-cache
app.get('*', (req, res) => {
    // Multiple layers of cache prevention
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    // Change ETag on every request to force revalidation
    res.setHeader('ETag', `"${Date.now()}"`);
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handler - must be last
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Start Server
app.listen(PORT, () => {
    console.log(`✓ MoVaRisCh Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Database: ${process.env.DB_NAME || 'movarisch'}`);
});
