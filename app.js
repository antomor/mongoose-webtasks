var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var MONGO_URL ='mongodb://amdevelop:test@ds021026.mlab.com:21026/amdevelop';
// config
var config = require('config.json');

var Schema = mongoose.Schema; //Schema.ObjectId

var app = new (require('express'))();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router();

// Schemas 
// Product Model
var Product = new Schema({
  title: { type: String, unique: true },
  description: { type: String, required: true },
  modified: { type: Date, default: Date.now }
});

// validation
Product.path('title').validate(function (v) {
  console.log("validate title");
  console.log(v);
  return v.length > 10 && v.length < 70;
});

Product.path('description').validate(function (v) {
  console.log("validate description");
  console.log(v);
  return v.length > 10;
}, 'Product description should be more than 10 characters');

var ProductModel = mongoose.model('Product', Product);

// start router.js
router.get('/api', function (req, res) {
  res.send('Products API is running');
});

// POST to CREATE
router.post('/api/products', function (req, res) {
  var product;

  // database
  mongoose.connect(MONGO_URL);
  //mongoose.connect(MONGO_URL);

  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description
  });
  product.save(function (err) {
    mongoose.connection.close();
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});

// PUT to UPDATE

// Bulk update
router.put('/api/products', function (req, res) {
  var i, len = 0;
  console.log("is Array req.body.products");
  console.log(Array.isArray(req.body.products));
  console.log("PUT: (products)");
  console.log(req.body.products);
  if (Array.isArray(req.body.products)) {
    len = req.body.products.length;
  }
  for (i = 0; i < len; i++) {
    console.log("UPDATE product by id:");
    for (var id in req.body.products[i]) {
      console.log(id);
    }
    mongoose.connect(MONGO_URL);
    ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
      mongoose.connection.close();
      if (err) {
        console.log("Error on update");
        console.log(err);
      } else {
        console.log("updated num: " + numAffected);
      }
    });
  }
  return res.send(req.body.products);
});

// Single update
router.put('/api/products/:id', function (req, res) {
  mongoose.connect(MONGO_URL);
  return ProductModel.findById(req.params.id, function (err, product) {
    product.title = req.body.title;
    product.description = req.body.description;
    return product.save(function (err) {
      mongoose.connection.close();
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(product);
    });
  });
});

// GET to READ

// List products
router.get('/api/products', function (req, res) {
  mongoose.connect(MONGO_URL);
  return ProductModel.find(function (err, products) {
    mongoose.connection.close();
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
});

// Single product
router.get('/api/products/:id', function (req, res) {
  mongoose.connect(MONGO_URL);
  return ProductModel.findById(req.params.id, function (err, product) {
    mongoose.connection.close();
    if (!err) {
      return res.send(product);
    } else {
      return console.log(err);
    }
  });
});

// DELETE to DESTROY
// Bulk destroy all products
router.delete('/api/products', function (req, res) {
  ProductModel.remove(function (err) {
    mongoose.connection.close();
    if (!err) {
      console.log("removed");
      return res.send('');
    } else {
      console.log(err);
    }
  });
});

// remove a single product
router.delete('/api/products/:id', function (req, res) {
  mongoose.connect(MONGO_URL);
  return ProductModel.findById(req.params.id, function (err, product) {
    return product.remove(function (err) {
      mongoose.connection.close();
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.use('/', router);
// launch server
app.listen(config.port);
// Start the server
console.log('Running on port ' + config.port);

