const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Models
const Product = require('../models/product');

//Front routes - no need for protection
router.get('/', (req, res, next) => {
    Product.find({}).then(products => {
        res.render('products', {
            title: 'Pick a Coffee for YOU',
            products: products
        });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Product.findById(id).then(product => {
        Product.find({}).select('_id title').then(products => {
            res.render('product', {
                title: product.title,
                product: product,
                products: products
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});

module.exports = router;