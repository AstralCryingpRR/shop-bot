const {Schema, model} = require('mongoose');

const User = Schema({
    idUser: String,
    login: String || 'unknown',
    balance: Number,
    permission: Boolean || false,
    total: Number,
    history: Array,
    notice: Boolean,
    lastUse: Number || new Date().getTime(),
    user: Object,
    subscribe: {
        name: String,
        duration: Number,
        subscribedAt: Object
    }
})

module.exports = model('User', User);