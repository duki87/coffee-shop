const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    numOfItems: 
    { 
        type: Number, 
        default: 1,
        required: false 
    },
    totalPrice: 
    { 
        type: Number, 
        default: 0,
        required: false 
    },
});

module.exports = mongoose.model('Cart', cartSchema, 'carts');