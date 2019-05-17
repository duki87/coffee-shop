const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Front routes - no need for protection
router.get('/', (req, res, next) => {
    res.render('cart', {
        title: 'Your Shopping Cart',

    });
});

module.exports = router;