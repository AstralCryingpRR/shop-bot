const {Schema, model} = require('mongoose');

const Product = Schema({
    link: String,
    type: String,
    id: Number,
    addressProduct: String,
    date: Number
})

module.exports = model('Product', Product);