const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const auth = require('../../config/auth');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');

//Front routes - no need for protection
router.get('/', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    //console.log(req.user._id);
    const token = cookieExtractor(req);
    const isLogged = auth(token);
    let cookie = cookieCartExtractor(req);
    if(cookie) {
        var cartId = (JSON.parse(cookie)).cartId;
    }
    Order.find({cartId: cartId})
        .populate({path:'cartId'})
        .populate({path:'productId'}).exec()
        .then(cart => {
            console.log(cart);
            res.render('cart', {
                title: 'Your Shopping Cart',
                isLogged: isLogged,
                active_page: 'cart',
                cart: cart
            });
        }).catch(err => {
            console.log(err);
        });
});

router.post('/add-to-cart', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    let userId = req.user._id;
    let cookie = cookieCartExtractor(req);
    let productId = req.body.productId;
    if(cookie) {        
        let cartId = (JSON.parse(cookie)).cartId;
        Cart.findById(cartId).then(cart => {
            if(cart) {
                Product.findById(productId).then(product => {
                    if(!product) {
                        req.flash('danger', 'Product does not exist!');
                        res.redirect(req.get('referer'));
                    } else {
                        if(product.stock === false) {
                            req.flash('danger', 'Out of stock!');
                            res.redirect(req.get('referer')); 
                        } else {
                            Order.findOne({cartId: cartId, productId: product._id}).then(order => {
                                if(order) {
                                    product.quantity--;
                                    if(product.quantity == 0) {
                                        product.stock = false;
                                    }
                                    product.save((err, updatedProduct) => {
                                        if (err) throw err;
                                        order.quantity++;
                                        order.subtotal += product.price;
                                        order.save((err, updatedOrder) => {
                                            if (err) throw err;
                                            cart.totalPrice += product.price;
                                            cart.numOfItems ++;
                                            cart.save((err, updatedCart) => {
                                                req.flash('success', 'Product quantity successfully updated!');
                                                res.redirect(req.get('referer'));
                                            });
                                        });
                                    });
                                } else {
                                    product.quantity--;
                                    if(product.quantity == 0) {
                                        product.stock = false;
                                    }
                                    product.save((err, updatedProduct) => {
                                        if (err) throw err;
                                        let order = new Order();
                                        order.cartId = cartId;
                                        order.productId = product._id;
                                        order.subtotal = product.price;
                                        order.save((err, newOrder) => {
                                            if (err) throw err;
                                            cart.totalPrice += product.price;
                                            cart.numOfItems ++;
                                            cart.save((err, updatedCart) => {
                                                req.flash('success', 'Product successfully added to cart!');
                                                res.redirect(req.get('referer'));
                                            });
                                        });
                                    });
                                }
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    } else {
        const cart = new Cart();
        cart.userId = userId;
        cart.save((err, newCart) => {
            if (err) throw err;
            Product.findById(productId).then(product => {
                if(!product) {
                    req.flash('danger', 'Product does not exist!');
                    res.redirect(req.get('referer'));
                } else {
                    if(product.stock === false) {
                        req.flash('danger', 'Out of stock!');
                        res.redirect(req.get('referer')); 
                    } else {
                        product.quantity--;
                        if(product.quantity == 0) {
                            product.stock = false;
                        }
                        product.save((err, updatedProduct) => {
                            if (err) throw err;
                            let order = new Order();
                            order.cartId = newCart._id;
                            order.productId = product._id;
                            order.subtotal = product.price;
                            order.save((err, newOrder) => {
                                if (err) throw err;
                                newCart.totalPrice += product.price;
                                newCart.save((err, updatedCart) => {
                                    req.flash('success', 'Product successfully added to cart!');
                                    res.cookie('cart', JSON.stringify({cartId:newCart._id}));
                                    res.redirect(req.get('referer'));
                                });
                            });
                        });
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        });        
    }
});

router.get('/remove-order/:id', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => { 
    Order.findByIdAndDelete(req.params.id, (err, deleted) => {
        if(err) throw err;
        let cookie = cookieCartExtractor(req);
        let cartId = (JSON.parse(cookie)).cartId;
        Order.find({cartId: cartId}, (err, cart) => {
            if(err) throw err;
            if(cart.length < 1) {
                Cart.findByIdAndDelete(cartId, (err, deleted) => {
                    if(err) throw err;
                    console.log(deleted._id)
                    res.clearCookie('cart');
                    res.json({message: 'EMPTY'});
                });
            } else {
                res.json({message: 'REMOVED'});
            }
        });
        //res.redirect(req.get('referer'));
    })
});

router.get('/remove-cart', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => { 
    let cookie = cookieCartExtractor(req);
    let cartId = (JSON.parse(cookie)).cartId;
    Order.deleteMany({cartId: cartId}, (err, deleted) => {
        if(err) throw err;
        Cart.findByIdAndDelete(cartId, (err, cart) => {
            if(err) throw err;
            res.clearCookie('cart');
            res.redirect('/');
        });
        //res.redirect(req.get('referer'));
    })
});

cookieExtractor = (req) => {
    var extracted = null;
    if (req && req.cookies) extracted = req.cookies['jwt'];
    return extracted;
};  

cookieCartExtractor = (req) => {
    var cookie = null;
    if (req && req.cookies) cookie = req.cookies['cart'];
    return cookie;
}

module.exports = router;