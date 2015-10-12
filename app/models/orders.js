var modelSchema = require('../utils/model');
var mongoose = require('mongoose');

// define the schema for our user model
var ordersSchema = modelSchema({
    // user: {type: mongoose.Schema.ObjectId, ref: 'users'},
    // file: {type: mongoose.Schema.ObjectId, ref: 'files'},

    _order: {type: mongoose.Schema.ObjectId, ref: ''},
    orderid: {type: String, index: { unique: true }},
    timestamp: {type: Date, default: Date.now},
    company: {type: String, required: true},
    address: {type: String, required: true},
    frmlat: {type: Number, required: true, default: 22.317820},
    fromlng: {type: Number, required: true, default: 87.302642},
    tolat: {type: Number, required: true, default: 22.317820},
    tolng: {type: Number, required: true, default: 87.302642},
    userid: {type: String, default: "UNASSIGNED"}
});

module.exports = mongoose.model('orders', ordersSchema);
