const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Still needed here for the comparePassword method

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { // This field will now store the *already hashed* password
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: [cartItemSchema]
}, {
    timestamps: true
});

// IMPORTANT: Removed the pre('save') hook.
// Hashing will now be handled directly in routes/auth.js before creating/updating the user.

// Method to compare an entered plain password with the hashed password stored in the database.
userSchema.methods.comparePassword = async function(candidatePassword) {
    // 'this.password' refers to the hashed password stored in the database for this user document
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
