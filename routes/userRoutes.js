const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')


router.get('/api/me',userController.me);

module.exports = router;