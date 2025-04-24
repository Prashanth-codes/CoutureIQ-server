const Order = require('../models/order');

exports.createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, paymentMethod } = req.body;

        const order = await Order.create({
            user: req.user.userId,
            products,
            shippingAddress,
            paymentMethod
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate('products.product')
            .sort('-createdAt');

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.userId
        }).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id },
            { status: req.body.status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};