const {Schema, model} = require('mongoose');

const Notice = Schema({
    id: String,
    date: Number,
    used: Boolean,
    type: String
})

module.exports = model('Notice', Notice);