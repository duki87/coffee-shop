const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const auth = require('../../config/auth');
const controller = require('../controllers/products');

//Models
const Product = require('../models/product');

//Front routes - no need for protection
router.get('/', controller.products);

router.get('/:id', controller.products);

router.post('/search', controller.search);

module.exports = router;