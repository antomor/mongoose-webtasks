var frisby = require('frisby');

var base_url = 'http://localhost:3000/api/';

frisby.create('api/products')
  .post(base_url + 'products',
  {
    title: "Test post T-Shirt",
    description: "Description of a T-Shirt added for testing the post",
  })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes({
    _id: String,
    title: String,
    description: String,
    modified: String
  })
  .expectJSON({
    title: "Test post T-Shirt",
    description: "Description of a T-Shirt added for testing the post"
  })
  .afterJSON(function (json) {
    // Now we use the json object for deleting the object just inserted
    frisby.create('Delete the product just added')
      .delete(base_url + 'products/' + json._id)
      .toss();
  })
  .toss();
