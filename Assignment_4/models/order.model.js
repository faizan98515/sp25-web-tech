const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    total: { 
        type: Number,
        required: true
    },
    imageUrl: { 
        type: String,
        required: false // Not strictly required, but good for display
    }
});

const orderSchema = new mongoose.Schema({
    userId: { // NEW: Reference to the User who placed the order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
        required: true
    },
    customerDetails: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        address: {
            type: String,
            required: true,
            trim: true
        }
    },
    items: [orderItemSchema], // Array of order items
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending (Cash on Delivery)', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending (Cash on Delivery)'
    }
}, {
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
