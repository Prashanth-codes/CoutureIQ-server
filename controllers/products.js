const Product = require('../models/product');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, sizes } = req.body;
        let parsedSizes;
        
        try {
            parsedSizes = JSON.parse(sizes);
            // Validate the size objects
            if (!Array.isArray(parsedSizes)) {
                throw new Error('Sizes must be an array');
            }
            
            // Ensure each size has the correct structure
            parsedSizes = parsedSizes.map(size => ({
                size: size.size,
                available: size.available !== false // defaults to true if not specified
            }));
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sizes format'
            });
        }

        let imageUrls = [];

        // Handle image uploads if files exist
        if (req.files && req.files.length > 0) {
            // Upload each image to cloudinary
            const uploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'products'
                });
            });

            const results = await Promise.all(uploadPromises);
            imageUrls = results.map(result => ({
                url: result.secure_url,
                public_id: result.public_id
            }));
        }

        // Create product
        const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            sizes: parsedSizes,
            images: imageUrls,
            seller: req.user._id // Make sure this matches your auth middleware
        });

        // Send response
        res.status(201).json({
            success: true,
            product,
            message: 'Product created successfully'
        });

    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error creating product' 
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('seller', 'name');
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, seller: req.user.userId },
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found or you are not authorized to delete this product' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.getRecommendedProducts = async (req, res) => {
    try {
        const { faceAnalysis } = req.body;
        
        // Get base query from face analysis
        const recommendationQuery = buildRecommendationQuery(faceAnalysis);
        
        // Find matching products
        const products = await Product.find(recommendationQuery)
            .populate('seller', 'name')
            .sort({ matchScore: -1 }); // Sort by match score

        res.json({
            success: true,
            recommendations: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

function buildRecommendationQuery(faceAnalysis) {
    const { faceShape, skinTone, colorPalette } = faceAnalysis;
    
    return {
        $and: [
            { category: { $in: getRecommendedCategories(faceShape) } },
            { colors: { $in: getRecommendedColors(skinTone) } }
        ]
    };
}