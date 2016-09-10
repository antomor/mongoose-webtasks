var application_root = __dirname;
var http = require('http');
var express = require("express");
var path = require("path");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var apiRouter = require('./router') 

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(bodyParser.json());

var router = express.Router();
apiRouter(router);

var server = http.createServer(app);

// database
mongoose.connect('mongodb://localhost/products');

// config
/*app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(application_root, "public")));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));*/

app.use('/', router);

// launch server
app.listen(4242);
// Start the server
console.log('Running on port ' + 4242);  
