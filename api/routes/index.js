const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const auth = require('../../config/auth');

router.get('/', (req, res, next) => {
    const token = cookieExtractor(req);
    const isLogged = auth(token);
    res.render('index', {
        title: 'Welcome to Coffee shop!',
        isLogged: isLogged
    });
});

cookieExtractor = (req) => {
    var extracted = null;
    if (req && req.cookies) extracted = req.cookies['jwt'];
    return extracted;
};   

module.exports = router;