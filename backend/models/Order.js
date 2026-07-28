const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['manual', 'razorpay', 'free'], default: 'manual' },
    screenshotPath: { type: String, required: false },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
