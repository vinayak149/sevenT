const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    //find user and establish identity
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                
                console.log('Error in finding user');
                return done(err);
            }

            if (!user || user.password != password) {
                console.log('Invalid username/password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

// serializing user to decide which key is to be kept in cookies
passport.serializeUser(function (user, done) {
    done(null, user.id); 
});

// deserializing user from cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {

            console.log('Error in finding user');
            return done(err);
        }

        return done(null, user);
    });
});

//check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }  

    //if user is not signed in
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains current signed in user from session cookie
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;