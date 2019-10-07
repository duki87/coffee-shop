const multer = require('multer');
const passport = require('passport');
const auth = require('../../config/auth');
const cookieExtractor = require('../../config/cookieExtractor');
const cookieCartExtractor = require('../../config/cookieCartExtractor');
const passportAuth = require('../../config/passportAuth');

//Models
const Product = require('../models/product');
const controller = { 
    products: (req, res, next) => {
        const cartCookie = cookieCartExtractor(req);
        const token = cookieExtractor(req);
        const isLogged = auth(token);
        Product.find({}).then(products => {
            res.render('products', {
                title: 'Pick a Coffee for YOU',
                products: products,
                isLogged: isLogged,
                active_page: 'products',
                cart_exist: cartCookie ? true : false
            });
        }).catch(err => {
            console.log(err);
        });
    },
    
    productId: (req, res, next) => {
        const cartCookie = cookieCartExtractor(req);
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
                    active_page: 'products',
                    cart_exist: cartCookie ? true : false
                });
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    },

    search: (req, res, next) => {   
        const cartCookie = cookieCartExtractor(req);
        const token = cookieExtractor(req);
        let search = req.body.search;
        const isLogged = auth(token);
        Product.find({title: { '$regex': '.*' + search + '.*', '$options': 'i' } }).then(results => {
            console.log(results);
            res.render('results', {
                title: 'Results for ' + search,
                results: results,
                isLogged: isLogged,
                cart_exist: cartCookie ? true : false
            });
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = controller;