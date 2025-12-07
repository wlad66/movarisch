const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const reportsController = require('../controllers/reports.controller');

router.get('/', verifyToken, reportsController.getAll);
router.post('/', verifyToken, reportsController.create);
router.delete('/:id', verifyToken, reportsController.delete);

module.exports = router;
