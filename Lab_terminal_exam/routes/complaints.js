const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Contact Us page
router.get('/contact', isAuthenticated, (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    user: req.user
  });
});

// Submit a complaint
router.post('/submit', isAuthenticated, async (req, res) => {
  try {
    const { orderId, message } = req.body;
    
    const complaint = new Complaint({
      user: req.user._id,
      orderId,
      message
    });

    await complaint.save();
    req.flash('success_msg', 'Your complaint has been submitted successfully.');
    res.redirect('/complaints/my-complaints');
  } catch (error) {
    req.flash('error_msg', 'Error submitting complaint. Please try again.');
    res.redirect('/complaints/contact');
  }
});

// View user's own complaints
router.get('/my-complaints', isAuthenticated, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.render('my-complaints', {
      title: 'My Complaints',
      user: req.user,
      complaints
    });
  } catch (error) {
    req.flash('error_msg', 'Error fetching complaints.');
    res.redirect('/');
  }
});

// Admin: View all complaints
router.get('/admin/all', isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.render('admin/complaints', {
      title: 'All Complaints',
      user: req.user,
      complaints
    });
  } catch (error) {
    req.flash('error_msg', 'Error fetching complaints.');
    res.redirect('/homepage');
  }
});

// Admin: Update complaint status
router.post('/admin/update-status/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status });
    req.flash('success_msg', 'Complaint status updated successfully.');
    res.redirect('/complaints/admin/all');
  } catch (error) {
    req.flash('error_msg', 'Error updating complaint status.');
    res.redirect('/complaints/admin/all');
  }
});

module.exports = router; 