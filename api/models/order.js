const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    cartId: 
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart', 
        required: true 
    },
    productId: 
    {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: 
    {
        type: Number,
        required: true,
        default: 1
    },
    subtotal: 
    {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Order', orderSchema, 'orders');