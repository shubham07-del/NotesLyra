const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ['free', 'paid'],
        default: 'paid'
    },
    upiId: {
        type: String,
        default: 'lenkasriram1@ybl'
    },
    payeeName: {
        type: String,
        default: 'Sriram Lenka'
    }
}, { timestamps: true });

// Singleton pattern - ensure only one settings document
paymentSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);
module.exports = PaymentSettings;
