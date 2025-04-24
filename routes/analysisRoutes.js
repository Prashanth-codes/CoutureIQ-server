const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeImage } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/analyze', protect, upload.single('image'), analyzeImage);

module.exports = router;