const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const auth = require('../../config/auth');

//Multer setup
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './public/uploads/profiles/')
    },
    filename: (req, file, cb) => {
        imageName = Date.now() +'-'+ file.originalname;
        cb(null, imageName);
    }
});
const fileFilter = (req, file, cb) => {
    //reject incoming file if filetype is not supported
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

//Models
const User = require('../models/user');

//Front routes 
router.get('/', passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/user/login',
        failureFlash: true
    }), (req, res, next) => {
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        res.render('user-profile', {
            title: 'Profile of user ' + req.user.name,
            userData: req.user,
            isLogged: isLogged
        });
});

router.get('/register', (req, res, next) => {
    res.render('register-user', {
        title: 'Register New User',
    });
});

router.get('/login', (req, res, next) => {
    res.render('login-user', {
        title: 'User Login',
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        session: false,
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true,
    }, (err, user, info) => {
        if (err || !user) {
            req.flash('danger', err.message);
            res.redirect('/user/login');
            return false;
            //res.status(500).send({'error': err.message});
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
                res.redirect('/user');
            });
        }
    })(req, res);
});

//Standard login function - commented because passport.js JWT method is used
/* router.post('/login', (req, res, next) => {
    let email = req.body.email;
    User.findOne({email: email}, (err, user) => {
        if(!user) {
            req.flash('danger', `User with email ${email} already exists!`);
            res.render('login-user', {
                title: 'Try Again'
            });
        } else {
            // Load hash from your password DB.
            bcrypt.compare(req.body.password, user.password, function(err, pass) {
                if(!pass) {
                    req.flash('danger', 'Password does not match!');
                    res.render('login-user', {
                        title: 'Try Again'
                    });
                } else {
                    // generate a signed son web token with the contents of user object and return it in the response
                    const token = jwt.sign({_id: user._id}, 'gigi');
                    //return res.json({token: `Bearer ${token}`});
                    req.flash('success', 'Logged in!');
                    res.render('index', {
                        title: 'Welcome'
                    }); 
                    return res.status(200).send({success: true, token: `bearer ${token}`});
                }
            });
        }
    })
}); */

router.post('/register', upload.single('image'), (req, res, next) => {
    let email = req.body.email;
    console.log(req.body.email);
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
});

module.exports = router;