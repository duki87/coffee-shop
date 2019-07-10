const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,  
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'default.png',
        required: false
    }
});

module.exports = mongoose.model('User', userSchema, 'users');