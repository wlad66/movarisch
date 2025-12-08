const express = require('express');
const cors = require('cors');
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

// Error handler - must be last
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✓ MoVaRisCh Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Database: ${process.env.DB_NAME || 'movarisch'}`);
});
