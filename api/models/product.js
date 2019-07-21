const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false
    },
    stock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema, 'products');