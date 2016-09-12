var frisby = require('frisby');

var base_url = 'http://localhost:3000/api/';

frisby.create('api/products')
  .get(base_url + 'products')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('0', {
    _id: String,
    title: String,
    description: String,
    __v: Number,
    modified: String
  })
  .expectJSON('0', {
    _id: "57d482ad6713f80ca585175e",
    title: "My Awesome T-shirt",
    description: "All about the details. Of course it's black.",
    __v: 0,
    modified: "2016-09-10T22:01:17.635Z"
  })
  .toss();

frisby.create('api/products/:id')
  .get(base_url + 'products/57d482ca6713f80ca5851760/')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    _id: String,
    title: String,
    description: String,
    __v: Number,
    modified: String
  })
  .expectJSON({
    _id: "57d482ca6713f80ca5851760",
    title: "My Awesome T-shirt, a new title",
    description: "All about the details. Of course it's black.",
    __v: 0,
    modified: "2016-09-10T22:01:46.508Z"
  })
  .toss();