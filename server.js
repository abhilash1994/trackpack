// Get all the tools we need from the repo
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// var privateFile = require('./path/file.js'); //just for clarification

var app = express();

app.use(bodyParser())      //for parsing body
app.use(methodOverride())  //to override methods

mongoose.connect("mongodb://localhost:27017/trackpack"); // Configure database

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, cache-control");
  next();
});

// Get db instance to pass in for other configurations
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected to database');
});

// Get the routes configuration
require('./app/routes')(app, db);

app.listen(3000);
