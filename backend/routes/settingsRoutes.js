const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getPaymentSettings, updatePaymentSettings } = require('../controllers/settings.controller');

// @desc    Get payment settings
// @route   GET /api/settings/payment
// @access  Public
router.get('/payment', getPaymentSettings);

// @desc    Update payment settings
// @route   PUT /api/settings/payment
// @access  Admin
router.put('/payment', protect, admin, updatePaymentSettings);

module.exports = router;
