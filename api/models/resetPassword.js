const mongoose = require('mongoose');

const resetSchema = mongoose.Schema({
    email: {
        type: String,  
        required: true 
    },
    resetToken: {
        type: String,
        required: true
    },
    dateExpire: {
        type: Date, 
        default: Date.now + 7*24*60*60*1000 
    }
});

module.exports = mongoose.model('User', userSchema, 'users');