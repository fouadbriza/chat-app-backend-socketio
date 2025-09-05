const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.post('/api/signup', authController.localSignup);
router.post('/api/login', authController.localLogin);



module.exports = router;

//router.post('/api/google', authController.google);
//router.post('/api/google/redirect', authController.google);



//to add 
//router.post('/logout', authController.logout);