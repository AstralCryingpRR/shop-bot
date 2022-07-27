const {Schema, model} = require('mongoose');

const Bill = Schema({
    type: String,
    id: Number,
    userId: String,
    bill: String,
    date: Number
})

module.exports = model('Bill', Bill);