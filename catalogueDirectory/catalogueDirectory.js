'use strict';

// loading the express and nedb dependencies
const express = require('express');
const Datastore = require('nedb');

// catalogue directory ip address and port
const PORT = 3000;
const HOST = 'localhost';

// create and load the catalogue database
const catalogueDatabase = new Datastore('catalogues.json');
catalogueDatabase.loadDatabase();

// define the server application
const app = express();

// configure express server options
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json({
  limit: '1mb'
}));
// make static content available
app.use(express.static('../portal'));

// add POST route for the add catalogues functionality
app.post('/addCatalogues', (request, response, next) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  catalogueDatabase.insert(data)
  console.log(data);
  response.json({
    status: 'success',
    echo: data
  });
});

// add GET route for the query catalogues functionality
app.get('/queryCatalogues', (request, response, next) => {
  catalogueDatabase.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

// run the server application
const server = app.listen(PORT, HOST, () => console.log(
  `Catalogue Directory listening on http://${HOST}:${PORT} ...`));