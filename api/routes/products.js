const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const auth = require('../../config/auth');

//Models
const Product = require('../models/product');

//Front routes - no need for protection
router.get('/', (req, res, next) => {
    const token = cookieExtractor(req);
    const isLogged = auth(token);
    Product.find({}).then(products => {
        res.render('products', {
            title: 'Pick a Coffee for YOU',
            products: products,
            isLogged: isLogged,
            active_page: 'products'
        });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/:id', (req, res, next) => {
    const token = cookieExtractor(req);
    const isLogged = auth(token);
    let id = req.params.id;
    Product.findById(id).then(product => {
        Product.find({}).select('_id title').then(products => {
            res.render('product', {
                title: product.title,
                product: product,
                products: products,
                isLogged: isLogged,
                active_page: 'products'
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
});

router.post('/search', (req, res, next) => {   
    const token = cookieExtractor(req);
    let search = req.body.search;
    const isLogged = auth(token);
    Product.find({title: { '$regex': '.*' + search + '.*', '$options': 'i' } }).then(results => {
        console.log(results);
        res.render('results', {
            title: 'Results for ' + search,
            results: results,
            isLogged: isLogged
        });
    }).catch(err => {
        console.log(err);
    });
});

cookieExtractor = (req) => {
    var extracted = null;
    if (req && req.cookies) extracted = req.cookies['jwt'];
    return extracted;
}; 

module.exports = router;