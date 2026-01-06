const express = require('express');
const router = express.Router();
const multer = require('multer');
const Order = require('../models/Order');
const PDF = require('../models/PDF');
const { protect, admin } = require('../middleware/authMiddleware');

// Multer Storage for Screenshots
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/screenshots/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        // Allow images
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only images are allowed'));
        }
        cb(null, true);
    },
});

// @desc    Create new order (Upload screenshot)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, upload.single('screenshot'), async (req, res) => {
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
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate('pdfId', 'title description');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .populate('pdfId', 'title price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Admin
router.put('/:id', protect, admin, async (req, res) => {
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
});

module.exports = router;
