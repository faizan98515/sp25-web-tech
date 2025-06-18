
module.exports = function(req, res, next) {
    if (req.session && req.session.userId && req.session.user && req.session.user.isAdmin) {
        return next(); 
    } else {
        req.flash('error_msg', 'Access Denied: You do not have administrator privileges.');
        if (!req.session.userId) {
            res.redirect('/login');
        } else {
            res.redirect('/homepage'); 
        }
    }
};
