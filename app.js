const express = require('express');
const path = require('path');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//API routes
const productRoutes = require('./api/routes/products');
const adminProductRoutes = require('./api/routes/admin-products')
const adminRoutes = require('./api/routes/admin');
const indexRoutes = require('./api/routes/index');
const orderRoutes = require('./api/routes/order');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Parse application
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
/* app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
}); */

//Mongoose
mongoose.connect('mongodb://duki87:VodaVrnjci87@ds155916.mlab.com:55916/coffee', 
    { useNewUrlParser: true }
);

//Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/products', productRoutes);
app.use('/cart', orderRoutes);

module.exports = app;