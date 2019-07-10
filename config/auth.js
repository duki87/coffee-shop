const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../api/models/user');
const config = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (token) => {    
    const secret = 'gigi';
    const verifyOptions = {
        issuer : 'CoffeeShop',
        audience : 'users'
    };
    //console.log(token);   
    try {
        jwt.verify(token, secret, verifyOptions);
        return true;
    } catch(err) {
        return false;
    }    
}