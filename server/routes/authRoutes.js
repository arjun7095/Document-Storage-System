// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register,getUserProfile,updateProfile } = require('../controllers/authController'); // Ensure both are correctly imported

// Routes
router.post('/login', login);
router.post('/register', register);
router.get('/profile', getUserProfile);
router.put('/profile/:userId', updateProfile);


module.exports = router;
