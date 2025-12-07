const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const workplacesController = require('../controllers/workplaces.controller');

// GET /api/workplaces - Get all workplaces
router.get('/', verifyToken, workplacesController.getAll);

// POST /api/workplaces - Create workplace
router.post('/', verifyToken, workplacesController.create);

// DELETE /api/workplaces/:id - Delete workplace
router.delete('/:id', verifyToken, workplacesController.delete);

module.exports = router;
