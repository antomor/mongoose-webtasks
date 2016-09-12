var express = require("express");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var apiRouter = require('./router');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());

var router = express.Router();
apiRouter(router);

// database
mongoose.connect('mongodb://localhost/products');

// config
var config = require('../config/config');

app.use('/', router);

// launch server
app.listen(config.port);
// Start the server
console.log('Running on port ' + config.port);  
