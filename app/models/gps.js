var modelSchema = require('../utils/model');
var mongoose = require('mongoose');

// define the schema for our user model
var gpsSchema = modelSchema({
    // user: {type: mongoose.Schema.ObjectId, ref: 'users'},
    // file: {type: mongoose.Schema.ObjectId, ref: 'files'},

    _gps: {type: mongoose.Schema.ObjectId, ref: ''},
    userid: {type: String, index: { unique: true }},
    userlat: {type: Number, required: true, default: 22.317820},
    userlng: {type: Number, required: true, default: 87.302642},
});

module.exports = mongoose.model('gps', gpsSchema);

