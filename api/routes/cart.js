const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const auth = require('../../config/auth');

//Front routes - no need for protection
router.get('/', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    const token = cookieExtractor(req);
    const isLogged = auth(token);
    res.render('cart', {
        title: 'Your Shopping Cart',
        isLogged: isLogged
    });
});

router.post('/add-to-cart', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => {
    let cookie = cookieCartExtractor(req);
    let productId = req.body.productId;
    if(cookie) {
        console.log(JSON.parse(cookie));
    } else {
        res.cookie('cart', JSON.stringify([{productId:productId, quantity:1}]));
    }
    //let cartId = req.body.cartId;
    
    //console.log(cartId);
    console.log(productId);
    req.flash('success', 'Product Added to Cart!');
    res.redirect(req.get('referer'));
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