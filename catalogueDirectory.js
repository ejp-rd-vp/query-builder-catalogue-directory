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

// configure and run the server
setup();

function setup() {
  try {
    // parse command line arguments
    var commandLineArguments = process.argv.slice(2);

    // check for proper usage
    if (commandLineArguments.length != 1) {
      console.error("Usage: node catalogueDirectory.js $PORT");
      return;
    } else {
      // run the server application
      const server = app.listen(commandLineArguments[0], () =>
        console.log(
          `Catalogue Directory listening on http://localhost:${commandLineArguments[0]} ...`
        )
      );
    }
  } catch (exception) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:setup(): ",
      exception
    );
  }
}

// add root GET route
app.get("/", (request, response, next) => {
  try {
    response.sendStatus(200);
  } catch (exception) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.get(/): ",
      exception
    );
  }
});

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
  } catch (exception) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ",
      exception
    );
  }
});

// use json web token authentication for POST requests
app.use(checkJwt);

// add POST route for the add catalogues functionality
app.post("/addCatalogue", (request, response, next) => {
  try {
    let nameExists = Boolean(false);
    const data = request.body;
    catalogueDatabase.find(
      { catalogueName: { $in: [data.catalogueName] } },
      (error, records) => {
        if (error) {
          console.error(error);
        } else if (records.length > 0) {
          nameExists = true;
          catalogueDatabase.find(
            { catalogueAddress: { $in: [data.catalogueAddress] } },
            (error, records) => {
              if (error) {
                console.error(error);
              } else if (records.length > 0 && nameExists) {
                response.sendStatus(400);
              } else {
                const timestamp = Date.now();
                data.timestamp = timestamp;
                data._id = Math.random()
                  .toString(36)
                  .substr(2, 9)
                  .toUpperCase();
                catalogueDatabase.insert(data);
                catalogueDatabase.persistence.compactDatafile();
                response.json({
                  status: "success",
                  id: data._id,
                });
              }
            }
          );
        }
      }
    );
  } catch (exception) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.post(/addCatalogue): ",
      exception
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
      "Error in catalogueDirectory:catalogueDirectory.js:app.post(/removeCatalogue): ",
      exception
    );
  }
});
