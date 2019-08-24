const express = require('express');
const router = express.Router();
const fs = require('fs');
const passport = require('passport');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/remove-order/:id', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/user/login',
    failureFlash: true
}), (req, res, next) => { 
    Order.findByIdAndDelete(req.params.id, (err, deleted) => {
        if(err) throw err;
        req.flash('success', 'Product successfully added to cart!');
        res.redirect(req.get('referer'));
    })
});

module.exports = router;