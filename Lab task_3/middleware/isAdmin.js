// This middleware checks if the logged-in user is an administrator
module.exports = function(req, res, next) {
    // Ensure user is authenticated AND has the isAdmin flag in their session user object
    if (req.session && req.session.userId && req.session.user && req.session.user.isAdmin) {
        return next(); // User is an admin, proceed
    } else {
        // User is not an admin, redirect or send forbidden status
        req.flash('error_msg', 'Access Denied: You do not have administrator privileges.');
        // Redirect to login if not authenticated, otherwise redirect to homepage or dashboard
        if (!req.session.userId) {
            res.redirect('/login');
        } else {
            res.redirect('/homepage'); // Or a generic unauthorized page
        }
    }
};
