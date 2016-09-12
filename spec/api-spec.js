var frisby = require('frisby');

var base_url = 'http://localhost:3000/api/';

frisby.create('Get entry point API')
  .get(base_url)
  .expectStatus(200)
.toss();