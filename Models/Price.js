const {Schema, model} = require('mongoose');

const Price = Schema({
    type: String,
    price: Number,
    priceStr: String
})

module.exports = model('Price', Price);