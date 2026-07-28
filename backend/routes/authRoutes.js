const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    signup,
    login,
    adminSetup,
    updateProfile,
    verifyEmail
} = require('../controllers/auth.controller');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', signup);

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
router.get('/verify/:token', verifyEmail);

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Admin login/setup (TEMPORARY: easy way to create admin)
// @route   POST /api/auth/admin-setup
// @access  Public (Protected by secret)
router.post('/admin-setup', adminSetup);

// @desc    Update user profile (email/password)
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, updateProfile);

module.exports = router;
