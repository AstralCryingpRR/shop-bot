const {Schema, model} = require('mongoose');

const Whitelist = Schema({
    list: Array,
    id: Number
})

module.exports = model('Whitelist', Whitelist);