var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var wt = require('webtask-tools');

var app = new (require('express'))();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Schema = mongoose.Schema; //Schema.ObjectId

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

function getProductModel() {
  var ProductModel;
  try {
    ProductModel = mongoose.model('Product');
  } catch (error) {
    ProductModel = mongoose.model('Product', Product);
  }
  return ProductModel;
}

// start router.js
app.get('/api', function (req, res) {
  res.send('Products API is running');
});

// POST to CREATE
app.post('/api/products', function (req, res) {
  var product;
  var ProductModel = getProductModel();
  // database
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
  
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
app.put('/api/products/:id', function (req, res) {
  var ProductModel = getProductModel();
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
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
app.get('/api/products', function (req, res) {
  var ProductModel = getProductModel();
  console.log(req.params);
  console.log(req.webtaskContext.data);
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
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
app.get('/api/products/:id', function (req, res) {
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
  var ProductModel = getProductModel();
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
app.delete('/api/products', function (req, res) {
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
  var ProductModel = getProductModel();
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
app.delete('/api/products/:id', function (req, res) {
  mongoose.connect(req.webtaskContext.data.MONGO_URL);
  var ProductModel = getProductModel();
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

module.exports = wt.fromExpress(app);
