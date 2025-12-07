const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const rolesController = require('../controllers/roles.controller');

router.get('/', verifyToken, rolesController.getAll);
router.post('/', verifyToken, rolesController.create);
router.delete('/:id', verifyToken, rolesController.delete);

module.exports = router;
