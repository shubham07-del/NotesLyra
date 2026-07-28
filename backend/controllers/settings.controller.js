const PaymentSettings = require('../models/PaymentSettings');

// @desc    Get payment settings
// @route   GET /api/settings/payment
// @access  Public
const getPaymentSettings = async (req, res) => {
    try {
        const settings = await PaymentSettings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment settings
// @route   PUT /api/settings/payment
// @access  Admin
const updatePaymentSettings = async (req, res) => {
    try {
        const { mode, upiId, payeeName } = req.body;
        let settings = await PaymentSettings.getSettings();

        if (mode) settings.mode = mode;
        if (upiId) settings.upiId = upiId;
        if (payeeName) settings.payeeName = payeeName;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPaymentSettings,
    updatePaymentSettings
};
