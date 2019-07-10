const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

//Models
const Product = require('../models/product');

//Multer setup
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        imageName = Date.now() +'-'+ file.originalname;
        cb(null, imageName);
    }
});
const fileFilter = (req, file, cb) => {
    //reject incoming file if filetype is not supported
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});

//Admin routes (must be protected)
router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        title: 'Add New Product'
    });
});

router.get('/delete-product/:id', (req, res, next) => {
    let id = req.params.id;
    Product.findByIdAndDelete(id).then(deletedProduct => {
        if(deletedProduct) {
            req.flash('success', 'Product Deleted!');
            res.redirect('/admin/products/manage-products');
        } else {
            console.log('SOMETHING WENT WRONG');
        }
    }).catch(err => {
        console.log(err);
    });    
});

router.get('/manage-products', (req, res, next) => {
    Product.find({}).then(products => {
        res.render('manage-products', {
            title: 'Manage Products',
            products: products
        });
    }).catch(err => {
        console.log(err);
    })
});

router.get('/manage-products/:id', (req, res, next) => {
    let id = req.params.id;
    Product.findById(id).then(product => {
        res.render('manage-product', {
            title: 'View Product',
            product: product
        });
    }).catch(err => {
        console.log(err);
    })
});

router.post('/add-product', upload.single('image'), (req, res, next) => {
    const product = new Product();
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.discount = req.body.discount;
    product.stock = req.body.stock;
     
    req.checkBody('title', 'Title is required!').notEmpty();
    req.checkBody('description', 'Description is required!').notEmpty();
    req.checkBody('price', 'Price is required!').notEmpty();
    req.checkBody('price', 'Price must be a number greater than 0!').isInt({ gt: 0 });
    req.checkBody('discount', 'Discount must be a number greater than 0!').isInt({ gt: 0 });
    //Get errors
    let errors = req.validationErrors();
    if(errors) {
        res.render('add-product', {
            errors: errors
        });
    } else {
        product.image = req.file.path;
        product.save((err) => {
            if(err) {
                console.log(err);
            } else {
                req.flash('success', 'Product Added!');
                res.redirect('/admin/products/manage-products');
            }
        });
    }
});

module.exports = router;