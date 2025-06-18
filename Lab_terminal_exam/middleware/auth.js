module.exports = function(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  req.flash('error_msg', 'You must be logged in');
  res.redirect('/login');
};
