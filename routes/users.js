const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, getTailors } = require('../controllers/users');
const { protect } = require('../middleware/auth');


router.get('/profile', protect, getUserProfile);


router.put('/profile', protect, updateProfile);


router.get('/tailors', protect, getTailors);

module.exports = router;