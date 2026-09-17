const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middlewares/auth');

router.get('/menus', verifyToken, menuController.getUserMenus);

module.exports = router;