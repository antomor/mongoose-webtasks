var ProductModel = require('./model');

function getAll(req, res) {
  return ProductModel.find(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
}

function get(req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    if (!err) {
      return res.send(product);
    } else {
      return console.log(err);
    }
  });
}

function post(req, res) {
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
}

function putAll(req, res) {
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
    ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
      if (err) {
        console.log("Error on update");
        console.log(err);
      } else {
        console.log("updated num: " + numAffected);
      }
    });
  }
  return res.send(req.body.products);

}

function put(req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    product.title = req.body.title;
    product.description = req.body.description;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(product);
    });
  });
}

function delAll(req, res) {
  ProductModel.remove(function (err) {
    if (!err) {
      console.log("removed");
      return res.send('');
    } else {
      console.log(err);
    }
  });
}

function del(req, res) {
  return ProductModel.findById(req.params.id, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
}


module.exports = {
  get: get,
  getAll: getAll,
  post: post,
  put: put,
  putAll: putAll,
  del: del,
  delAll: delAll
};
