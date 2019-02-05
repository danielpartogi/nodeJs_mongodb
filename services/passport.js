const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');

passport.serializeUser((users, done) => {
    done(null, users.id);
});


passport.deserializeUser((id, done) => {
    User.findById(id).then(users => {
        done(null, users);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        }, 
        (accessToken, refreshToken, profile, done)=> {
            User.findOne({
                googleId: profile.id
            }).then( existingUser => {
                if(existingUser) {
                  done(null, existingUser);

                } else {
                    //don't have id
                    new User({ googleId: profile.id }).save()
                        .then(users => done(null, users))
                }
            })
        }
    )
);