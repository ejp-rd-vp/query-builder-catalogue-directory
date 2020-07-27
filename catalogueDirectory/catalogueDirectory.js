"use strict";

// loading the express and nedb dependencies
const express = require("express");
const Datastore = require("nedb");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// create and load the catalogue database
const catalogueDatabase = new Datastore("./catalogues.json");
catalogueDatabase.loadDatabase();

// define the server application
const app = express();

// add helmet to enhance security
app.use(helmet());

// add morgan to log HTTP requests
app.use(morgan("dev"));

// add cross origin resource sharing
app.use(cors());

// create json web token validation
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-luoogqm3.eu.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: "http://express.api",
  issuer: `https://dev-luoogqm3.eu.auth0.com/`,
  algorithms: ["RS256"],
});

// configure express server options
app.use(
  express.json({
    limit: "1mb",
  })
);

// parse command line arguments
var commandLineArguments = process.argv.slice(2);

// run the server application
const server = app.listen(
  commandLineArguments[1],
  commandLineArguments[0],
  () =>
    console.log(
      `Catalogue Directory listening on http://${commandLineArguments[0]}:${commandLineArguments[1]} ...`
    )
);

// add GET route for the query catalogues functionality
app.get("/getCatalogues", (request, response, next) => {
  try {
    catalogueDatabase.find({}, (err, data) => {
      if (err) {
        response.end();
        return;
      }
      response.json(data);
    });
  } catch (error) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ",
      error
    );
  }
});

// use json web token authentication for POST requests
app.use(checkJwt);

// add POST route for the add catalogues functionality
app.post("/addCatalogue", (request, response, next) => {
  try {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    data._id = Math.random().toString(36).substr(2, 9).toUpperCase();
    catalogueDatabase.insert(data);
    response.json({
      status: "success",
      id: data._id,
    });
  } catch (error) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.post(/addCatalogue): ",
      error
    );
  }
});

// add POST route for the add catalogues functionality
app.post("/removeCatalogue", (request, response, next) => {
  try {
    const data = request.body;
    catalogueDatabase.find({ _id: { $in: [data.catalogueID] } }, function (
      error,
      docs
    ) {
      if (error) {
        console.error(error);
      } else if (!docs.length) {
        response.sendStatus(404);
      } else {
        catalogueDatabase.remove({ _id: data.catalogueID }, {}, (error) => {
          if (error) {
            console.error(error);
          } else {
            catalogueDatabase.persistence.compactDatafile();
            response.json({
              status: "success",
            });
          }
        });
      }
    });
  } catch (exception) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.post(/addCatalogue): ",
      exception
    );
  }
});
