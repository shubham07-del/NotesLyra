const Order = require('../models/Order');
const PDF = require('../models/PDF');
const PaymentSettings = require('../models/PaymentSettings');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order (Free mode - no screenshot required)
// @route   POST /api/orders/free
// @access  Private
const createFreeOrder = async (req, res) => {
    try {
        const { pdfId } = req.body;
        const pdf = await PDF.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        // Verify payment mode is free
        if (!pdf.isFree) {
            return res.status(400).json({ message: 'Payment is required' });
        }

        // Check if already ordered
        const existingOrder = await Order.findOne({ userId: req.user._id, pdfId });
        if (existingOrder) {
            if (existingOrder.status === 'approved') {
                return res.status(400).json({ message: 'You already own this note' });
            }
            // Update existing order to approved if it was pending/rejected
            existingOrder.status = 'approved';
            existingOrder.screenshotPath = 'FREE_ACCESS';
            await existingOrder.save();
            return res.json(existingOrder);
        }

        const order = new Order({
            userId: req.user._id,
            pdfId,
            amount: 0,
            screenshotPath: 'FREE_ACCESS',
            status: 'approved'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order (Upload screenshot)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { pdfId } = req.body;
        const pdf = await PDF.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        // Check if already ordered
        const existingOrder = await Order.findOne({ userId: req.user._id, pdfId });
        if (existingOrder) {
            // If rejected, might allow re-ordering, but for now just return existing
            if (existingOrder.status === 'approved') {
                return res.status(400).json({ message: 'You already own this note' });
            }
            // If pending, tell them to wait
            if (existingOrder.status === 'pending') {
                return res.status(400).json({ message: 'Order already pending approval' });
            }
        }

        const order = new Order({
            userId: req.user._id,
            pdfId,
            amount: pdf.price,
            screenshotPath: req.file.path,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('pdfId', 'title description');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .populate('pdfId', 'title price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Admin
const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay/create
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { pdfId } = req.body;
        const pdf = await PDF.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        // Check if already ordered
        const existingOrder = await Order.findOne({ userId: req.user._id, pdfId });
        if (existingOrder) {
            if (existingOrder.status === 'approved') {
                return res.status(400).json({ message: 'You already own this note' });
            }
        }

        const amountInPaise = pdf.price * 100;
        if (amountInPaise < 100) {
            return res.status(400).json({ message: 'Amount must be at least ₹1' });
        }

        // Create razorpay order
        const options = {
            amount: amountInPaise, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const order = new Order({
            userId: req.user._id,
            pdfId,
            amount: pdf.price,
            paymentMethod: 'razorpay',
            razorpayOrderId: razorpayOrder.id,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            razorpayOrder,
            orderId: order._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment verification details' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
            if (order) {
                order.status = 'approved';
                order.razorpayPaymentId = razorpay_payment_id;
                await order.save();
                res.json({ message: 'Payment verified successfully', order });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFreeOrder,
    createOrder,
    getMyOrders,
    getOrders,
    updateOrder,
    createRazorpayOrder,
    verifyRazorpayPayment
};
