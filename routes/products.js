const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth');
const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct,
    deleteProduct 
} = require('../controllers/products');

// Configure multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
router.post('/', 
    protect, 
    authorize('retailer'),
    upload.array('images', 5), // Allow up to 5 images
    createProduct
);

// Other routes remain the same
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, authorize('retailer'), updateProduct);
router.delete('/:id', protect, authorize('retailer'), deleteProduct);

module.exports = router;