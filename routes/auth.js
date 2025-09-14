const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.post('/signup', authController.localSignup);
router.post('/login', authController.localLogin);
router.get('/google/callback', authController.google); // OAuth2


module.exports = router;

//router.post('/api/google', authController.google);
//router.post('/api/google/redirect', authController.google);



//to add 
//router.post('/logout', authController.logout);