'use strict';

// loading the express dependency
const express = require('express');

// catalogue directory ip address and port
const PORT = 3000;
const HOST = 'localhost';

// define and run the server application
const app = express();
app.listen(PORT, () => console.log(`Catalogue Directory listening on http://${HOST}:${PORT} ...`));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json({limit: '1mb'}));

app.post('/catalogues', (request, response, next) => {
  console.log(request.body);
  response.json({
    status: 'success',
    echo: request.body
  });
});

app.get('/', (request, response, next) => {
  response.send('EJP - Central query portal - Catalogue directory');
});

app.get('/catalogues', (request, response, next) => {
  response.send('/catalogues/db.json');
});


