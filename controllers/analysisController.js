const cloudinary = require('../config/cloudinary');

exports.analyzeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'analysis',
            resource_type: 'auto'
        });

        // In your analyzeImage function:
        const analysis = {
            faceShape: analyzeFaceShape(result),
            skinTone: analyzeSkinTone(result),
            bodyType: analyzeBodyType(result),
            recommendedStyles: [],
            imageUrl: result.secure_url  // Make sure this is being set
        };

        // Analyze and get recommended styles
        analysis.recommendedStyles = getRecommendedStyles(analysis.faceShape, analysis.skinTone);

        // Generate measurements
        const measurements = {
            chest: generateMeasurement(36, 46),
            waist: generateMeasurement(28, 40),
            hips: generateMeasurement(36, 48),
            inseam: generateMeasurement(28, 34),
            shoulder: generateMeasurement(16, 20),
            armLength: generateMeasurement(22, 26)
        };

        // Send response with explicit imageUrl
        res.status(200).json({
            success: true,
            analysis: {
                ...analysis,
                imageUrl: result.secure_url  // Explicitly include the URL
            },
            measurements
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing image'
        });
    }
};

// Helper functions
function generateMeasurement(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

function analyzeFaceShape(imageData) {
    // Add actual face shape analysis logic here
    const shapes = ['oval', 'round', 'square', 'heart'];
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function analyzeSkinTone(imageData) {
    // Add actual skin tone analysis logic here
    const tones = ['warm', 'cool', 'neutral'];
    return tones[Math.floor(Math.random() * tones.length)];
}

function analyzeBodyType(imageData) {
    // Add actual body type analysis logic here
    const types = ['hourglass', 'athletic', 'pear', 'apple'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRecommendedStyles(faceShape, skinTone) {
    const styleMap = {
        oval: ['Classic', 'Balanced', 'Versatile'],
        round: ['Angular', 'V-neck', 'Structured'],
        square: ['Soft', 'Rounded', 'Flowing'],
        heart: ['Balanced', 'Structured', 'Proportional']
    };

    return styleMap[faceShape] || ['Classic', 'Balanced', 'Versatile'];
}