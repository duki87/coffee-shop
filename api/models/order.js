const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart', 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Order', productSchema, 'orders');