const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');


router.get('/api/me', userController.me);
router.post('api/edit', userController.edit)



module.exports = router;//ask is the logout an backend thing or frontend thing?