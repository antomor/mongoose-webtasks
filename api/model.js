var mongoose     = require('mongoose');  
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

var ProductModel = mongoose.model('Product', Product);

module.exports = ProductModel;

/* Product Document 
[
{  
  "title": "My Awesome T-shirt",  
  "description": "All about the details. Of course it's black.",  
}
]
*/