const express = require('express');
const path = require('path');
const app = express();
const pug = require('pug');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const FormData = require('form-data');
const cors = require('cors');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/db');
const passport = require('passport');
const cookieParser = require('cookie-parser');

//Define localStorage
if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//Passport Config File
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Express session middleware 
app.use(session({
    secret: 'gigi',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true },
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//API routes
const productRoutes = require('./api/routes/products');
const adminProductRoutes = require('./api/routes/admin-products')
const adminRoutes = require('./api/routes/admin');
const indexRoutes = require('./api/routes/index');
const cartRoutes = require('./api/routes/cart');
const userRoutes = require('./api/routes/user');
const orderRoutes = require('./api/routes/order');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Parse application
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Use cors
app.use(cors());
app.use(cookieParser());

//CORS
/*  app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});  */

//Mongoose
mongoose.connect(config.database, 
    { useNewUrlParser: true }
);

//Routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/products',  productRoutes);
app.use('/cart', cartRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes);

module.exports = app;