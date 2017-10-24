module.exports = {
    isAuthenticated: function isAuthenticated(req,res,next){
        if (!req.session.user) {
            req.flash('err','please log in');
            return res.redirect('/');
        }
        next();
    },
    notAuthenticated: function notAuthenticated(req,res,next){
        next();
    }
};
