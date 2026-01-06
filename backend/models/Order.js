const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true },
    amount: { type: Number, required: true },
    screenshotPath: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
