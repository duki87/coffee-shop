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
    res.render('cart', {
        title: 'Your Shopping Cart',
        isLogged: isLogged,
        active_page: 'cart'
    });
});

router.post('/add-to-cart', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    //console.log(req.user._id);
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