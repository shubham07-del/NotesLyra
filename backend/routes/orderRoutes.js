const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const {
    createFreeOrder,
    createOrder,
    getMyOrders,
    getOrders,
    updateOrder,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require('../controllers/order.controller');

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

// @desc    Create new order (Free mode - no screenshot required)
// @route   POST /api/orders/free
// @access  Private
router.post('/free', protect, createFreeOrder);

// @desc    Create new order (Upload screenshot)
// @route   POST /api/orders
// @access  Private
router.post('/', protect, upload.single('screenshot'), createOrder);

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay/create
// @access  Private
router.post('/razorpay/create', protect, createRazorpayOrder);

// @desc    Verify Razorpay payment
// @route   POST /api/orders/razorpay/verify
// @access  Private
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
router.get('/my', protect, getMyOrders);

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
router.get('/', protect, admin, getOrders);

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Admin
router.put('/:id', protect, admin, updateOrder);

module.exports = router;
