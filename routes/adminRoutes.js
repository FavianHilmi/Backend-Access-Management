const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/auth');

router.post('/menus', verifyToken, adminController.createMenu);
router.post('/role-access', verifyToken, adminController.assignRoleAccess);

module.exports = router;