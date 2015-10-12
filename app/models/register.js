var modelSchema = require('../utils/model');
var mongoose = require('mongoose');

// define the schema for our user model
var registerSchema = modelSchema({
    company: {type: String},
    userid: {type: String}
});

module.exports = mongoose.model('registers', registerSchema);
