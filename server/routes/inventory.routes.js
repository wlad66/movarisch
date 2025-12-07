const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const inventoryController = require('../controllers/inventory.controller');

router.get('/', verifyToken, inventoryController.getAll);
router.post('/', verifyToken, inventoryController.create);
router.put('/:id', verifyToken, inventoryController.update);
router.delete('/:id', verifyToken, inventoryController.delete);

module.exports = router;
