const User = require('../models/user');

module.exports.profile = function (req, res) {
    if (req.cookie.user_id) {
        User.findById(req.cookie.user_id, function (err, user) {
            if (user) {
                return res.render(user_profile, {
                    title: "User profile",
                    user: user
               })
            }

            return res.redirect('/user/sign-in');
        });
    } else {
        return res.redirect('/user/sign-in');
   }
}

module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: "Stinky | Sign Up"
    })
}

module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: "Stinky | Sign In"
    })
}

module.exports.signOut = function (req, res) {
    // Clear the user_id cookie to sign the user out
    res.clearCookie('user_id');
    // Redirect to the sign-in page or any other appropriate page
    res.redirect('/user/sign-in');
}

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            console.log("error in finding user while signing up");
            return;
        }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log("error in creating user while signing up"); return; }

                res.redirect('/user/sign-in');
            })
        } else {
            return res.redirect('back');
        }
    })
}

module.exports.createSession = function (req, res) {
    
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log("error in finding user while signing in"); return; }
        
        //handle user found
        if(user){
            if (user.password != req.body.password) {
                return res.redirect('back')
            } 
                res.cookie('user_id', user.id);
                res.redirect('/user/profile');
            
        } else {
            return res.redirect('back');
        }
    });
}