'use strict';

// loading the express dependency
const express = require('express');

// catalogue directory ip address and port
const PORT = 3000;
const HOST = 'localhost';

// define and run the server application
const app = express();
app.listen(PORT, HOST, () => console.log(`Catalogue Directory listening on http://${HOST}:${PORT} ...`));
app.get('/', (req, res) => {
  res.send('EJP - Central query portal - Catalogue directory');
});


