const express = require('express');
const bcrypt = require('bcryptjs'); 
const router = express.Router();
const User = require('../models/user.model'); 

router.get('/register', (req, res) => {
    res.render('register', { layout: false });
});

router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validation checks
    if (!username || !password || !confirmPassword) {
        req.flash('error_msg', 'Please enter all fields.');
        return res.redirect('/register');
    }
    if (password.length < 6) {
        req.flash('error_msg', 'Password must be at least 6 characters.');
        return res.redirect('/register');
    }
    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match.');
        return res.redirect('/register');
    }

    try {
        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            req.flash('error_msg', 'Username is already taken.');
            return res.redirect('/register');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword, // Store the hashed password
            isAdmin: false // Default to not admin during registration
        });
        await newUser.save(); // No pre-save hook will hash it again

        req.flash('success_msg', 'Registration successful! Please log in.');
        res.redirect('/login');

    } catch (err) {
        console.error('Error registering user:', err);
        req.flash('error_msg', 'Something went wrong during registration.');
        res.redirect('/register');
    }
});


router.get('/login', (req, res) => {
    res.render('login', { layout: false });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash('error_msg', 'Please enter both username and password.');
        return res.redirect('/login');
    }

    try {
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            req.flash('error_msg', 'Invalid username or password.');
            return res.redirect('/login');
        }

        const match = await user.comparePassword(password); // This will compare plain 'password' with stored 'user.password'

        if (match) {
            req.session.userId = user._id;
            req.session.user = { username: user.username, isAdmin: user.isAdmin };

            req.flash('success_msg', 'Logged in successfully!');
            if (user.isAdmin) {
                res.redirect('/admin/products');
            } else {
                res.redirect('/homepage');
            }

        } else {
            req.flash('error_msg', 'Invalid username or password.');
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Error during login:', err);
        req.flash('error_msg', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res, next) => {
    req.flash('success_msg', 'You have been logged out.');
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
