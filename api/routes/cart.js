const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const auth = require('../../config/auth');
const controller = require('../controllers/cart');
const passportAuth = require('../../config/passportAuth');

//Models
const Cart = require('../models/cart');
const Order = require('../models/order');
const Product = require('../models/product');

//Front routes - no need for protection
router.get('/', passportAuth.jwt, controller.cart);

router.post('/add-to-cart', passportAuth.jwt, controller.addToCart);

router.get('/remove-order/:id', passportAuth.jwt, controller.removeOrderId);

router.get('/remove-cart', passportAuth.jwt, controller.removeCart);

router.put('/updateQuantity/:id', passportAuth.jwt, controller.updateQty);

module.exports = router;