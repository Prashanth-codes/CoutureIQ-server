const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        size: String,
        customizations: {
            type: Map,
            of: String
        },
        price: Number
    }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'card', 'upi']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'processing'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    tailorAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    measurementDetails: {
        type: Map,
        of: Number
    },
    trackingInfo: {
        courier: String,
        trackingNumber: String,
        expectedDelivery: Date
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', async function(next) {
    if (this.isModified('products')) {
        this.totalAmount = this.products.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);