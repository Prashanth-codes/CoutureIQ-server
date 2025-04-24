const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    fallback: {
        type: String,
        default: 'https://via.placeholder.com/400'
    },
    public_id: String
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['saree', 'lehenga', 'kurta', 'ethnic-wear']
    },
    sizes: [{
        size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
        },
        available: {
            type: Boolean,
            default: true
        }
    }],
    images: [imageSchema],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    styleAttributes: {
        necklineType: String,
        pattern: String,
        colorTone: String,
        faceShapeMatch: [String],
        colorToneMatch: [String]
    }
}, {
    timestamps: true
});

// Add a method to get safe image URL
productSchema.methods.getSafeImageUrl = function(index = 0) {
    if (this.images && this.images[index]) {
        return this.images[index].url || this.images[index].fallback;
    }
    return 'https://via.placeholder.com/400';
};

module.exports = mongoose.model('Product', productSchema);