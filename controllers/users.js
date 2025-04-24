const User = require('../models/user');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = {
            name: req.body.name,
            measurements: req.body.measurements,
            address: req.body.address,
            phone: req.body.phone
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTailors = async (req, res) => {
    try {
        const tailors = await User.find({ role: 'tailor' })
            .select('name address phone');
        res.json({ success: true, tailors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};