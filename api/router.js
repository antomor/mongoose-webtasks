var handlers = require('./handlers');

// REST api
module.exports = function (router) {
  router.get('/api', function (req, res) {
    res.send('Ecomm API is running');
  });

  // POST to CREATE
  router.post('/api/products', handlers.post);

  // PUT to UPDATE
  // Bulk update
  router.put('/api/products', handlers.putAll);
  // Single update
  router.put('/api/products/:id', handlers.put);

  // GET to READ
  // List products
  router.get('/api/products', handlers.getAll);

  // Single product
  router.get('/api/products/:id', handlers.get);

  // DELETE to DESTROY
  // Bulk destroy all products
  router.delete('/api/products', handlers.delAll);
  // remove a single product
  router.delete('/api/products/:id', handlers.del);
};

