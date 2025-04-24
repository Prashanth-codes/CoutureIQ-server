const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus 
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, createOrder);

// @route   GET api/orders
// @desc    Get logged in user orders
// @access  Private
router.get('/', protect, getUserOrders);

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private/Retailer/Tailor
router.put('/:id/status', 
    protect, 
    authorize('retailer', 'tailor'), 
    updateOrderStatus
);

module.exports = router;