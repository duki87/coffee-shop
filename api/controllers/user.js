const auth = require('../../config/auth');
const cookieExtractor = require('../../config/cookieExtractor');
const cookieCartExtractor = require('../../config/cookieCartExtractor');
const bcrypt = require('bcryptjs');
const passport = require('passport'); //delete
const jwt = require('jsonwebtoken');
const fs = require('fs');

//Models
const User = require('../models/user');

//const cookie = cookieCartExtractor(req);

const controller = {
    profile: (req, res, next) => {
        const cartCookie = cookieCartExtractor(req);
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        res.render('user-profile', {
            title: 'Profile of user ' + req.user.name,
            userData: req.user,
            isLogged: isLogged,
            active_page: 'profile',
            cart_exist: cartCookie ? true : false
        });
    },

    getRegister: (req, res, next) => {
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        if(isLogged) {
            //backURL = req.header('Referrer') || '/';
            res.redirect('back');
        } else {
            res.render('register-user', {
                title: 'Register New User',
                active_page: 'register'
            });
        }
    },

    postLogin: (req, res, next) => {
        passport.authenticate('local', {
            session: false,
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true,
        }, (err, user, info) => {
            if (err || !user) {
                req.flash('danger', info.message);
                res.redirect('/user/login');
                return false;
            } else {
                req.login(user, {session: false}, (err) => {
                    if (err) {
                        res.send(err);
                        return false;
                    }           
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({_id: user._id}, 'gigi', {expiresIn: 3600, issuer: 'CoffeeShop', audience: 'users'});
                    //return res.status(200).send({success: true, token: `bearer ${token}`});
                    res.cookie('jwt', token); // send a cookie with jwt
                    //res.json({ success: true, token: 'JWT ' + token });
                    req.flash('success', info.message);
                    res.redirect('/user');
                });
            }
        })(req, res, next);
    },

    getLogin: (req, res, next) => {
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        if(isLogged) {
            //backURL = req.header('Referrer') || '/';
            res.redirect('back');
        } else {
            res.render('login-user', {
                title: 'User Login',
                active_page: 'login',
            });
        }
    },

    postRegister: (req, res, next) => {
        let email = req.body.email;
        //console.log(req.file);
        User.findOne({email: email}, (err, user) => {
            if(user) {
                req.flash('danger', `User with email ${email} already exists!`);
                res.render('register-user', {
                    title: 'Try Again'
                });
            } else {
                req.checkBody('email', 'Email is required!').notEmpty();
                req.checkBody('email', 'Email is not valid!').isEmail();
                req.checkBody('name', 'Name is required!').notEmpty();
                req.checkBody('password', 'Password is required!').notEmpty();
                req.checkBody('password', 'Password must have at least 5 characters!').isLength({ min: 5 });
                //Get errors
                let errors = req.validationErrors();
                if(errors) {
                    res.render('register-user', {
                        errors: errors
                    });
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if(hash) {
                                const newUser = new User();
                                newUser.email = req.body.email;
                                newUser.name = req.body.name;
                                newUser.image = req.file.filename || 'default.png';
                                newUser.password = hash;                          
                                if(newUser.save()) {
                                    req.flash('success', 'User registered successfully!');
                                    res.redirect('/user/login');
                                }
                            } else {
                                req.flash('danger', 'Something went wrong!');
                                res.render('register-user', {
                                    title: 'Try Again'
                                });
                            }
                        });
                    });
                }
            }
        });
    },

    logout: (req, res, next) => {
        res.clearCookie('jwt');
        res.clearCookie('cart');
        res.redirect('/');
    },

    changePhoto: (req, res, next) => {
        User.findOne({_id: req.user._id}, (err, user) => {
            if(err) throw err;
            if(user.image === 'default.png') {
                user.image = req.file.filename;
                user.save((err) => {
                    if(err) throw err;
                    req.flash('success', 'Profile image changed!');
                    res.redirect('/user');
                });
            } else {
                const path = './public/uploads/profiles/' + user.image;
                fs.unlink(path, (err) => {
                    if (err) throw err;
                    user.image = req.file.filename;
                    user.save((err) => {
                        if(err) throw err;
                        req.flash('success', 'Profile image changed!');
                        res.redirect('/user');
                    });
                });
            }
        });
    },

    editProfile: (req, res, next) => {
        const cartCookie = cookieCartExtractor(req);
        if(req.body.email !== '') {
            req.checkBody('email', 'Email is not valid!').isEmail();
        }    
        //Get errors
        let errors = req.validationErrors();
        if(errors) {
            res.render('user-profile', {
                title: 'Profile of user ' + req.user.name,
                userData: req.user,
                active_page: 'profile',
                cart_exist: cartCookie ? true : false,
                errors: errors
            });
        }
        User.findOne({_id: req.user._id}, (err, user) => { 
            if (err) throw err;
            if(req.body.password == '') {
                user.email = req.body.email;
                user.name = req.body.name;
                user.save((err) => {
                    if(err) throw err;
                    req.flash('success', 'Profile data edited!');
                    res.redirect('/user');
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if(hash) {
                            user.email = req.body.email || req.user.email;
                            user.name = req.body.name || req.user.name;
                            user.password = hash;                          
                            user.save((err) => {
                                if(err) throw err;
                                req.flash('success', 'Profile data edited!');
                                res.redirect('/user');
                            });
                        } else {
                            req.flash('danger', 'Something went wrong!');
                            res.render('register-user', {
                                title: 'Try Again'
                            });
                        }
                    });
                });
            }       
        });
    },

    deactivateAccount: (req, res, next) => {

    },

    resetPassword: (req, res, next) => {
        
    }
}

module.exports = controller;