const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    originalPrice: {
        type: String,
        required: false
    },
    discountedPrice: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['New Lines Added', 'Sale'],
        required: false
    },
    colors: {
        type: [String],
        default: []
    },
    quantity: { // NEW: Quantity field
        type: Number,
        required: true,
        min: 0, // Quantity cannot be negative
        default: 0 // Default to 0 if not provided
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
