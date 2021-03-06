const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../api/models/user');
const config = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};

module.exports = (passport) => {
    //Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
        },
        function(email, password, done) {
            //this one is typically a DB call. 
            //Assume that the returned user object is pre-formatted and ready for storing in JWT
            return User.findOne({email: email}, (err, user) => {
                if(err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'User with this email does not exist. Please try again.'});
                }
                // Load hash from your password DB.
                bcrypt.compare(password, user.password, function(err, pass) {
                    if(!pass) {
                        return done(null, false, {message: 'Wrong password. Please try again.'});
                    } else {
                        //const token = jwt.sign({_id: user._id}, 'gigi');
                        return done(null, user, {message: `Welcome, ${user.name}`});               
                    }
                });            
            });
        }
    ));

    //JWT Strategy
    var opts = {}
    //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("bearer"); 
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = 'gigi';
    opts.issuer = 'CoffeeShop';
    opts.audience = 'users';
    passport.use(new JwtStrategy(opts, function(jwtPayload, done) {
        User.findOne({_id: jwtPayload._id}, (err, user) => {
            if(err) {
                return done(err, false);
            }
            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));
    //return passport.initialize();
}