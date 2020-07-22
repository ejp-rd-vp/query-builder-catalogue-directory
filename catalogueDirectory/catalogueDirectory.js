"use strict";

// loading the express and nedb dependencies
const express = require("express");
const Datastore = require("nedb");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();

// create and load the catalogue database
const catalogueDatabase = new Datastore(process.env.DATABASE_PATH);
catalogueDatabase.loadDatabase();

// define the server application
const app = express();

// add helmet to enhance security
app.use(helmet());

// add cross origin resource sharing
app.use(cors());

// add morgan to log HTTP requests
app.use(morgan("dev"));

// configure express server options
app.use(
  express.json({
    limit: "1mb",
  })
);

// make static content available
app.use(express.static("../portal"));

// run the server application
const server = app.listen(process.env.PORT, process.env.HOST, () =>
  console.log(
    `Catalogue Directory listening on http://${process.env.HOST}:${process.env.PORT} ...`
  )
);

// function that handles fetch errors
function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

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

app.get("/pingCatalogue", async (request, response, next) => {
  fetch(request.query.address)
    .then(handleFetchErrors)
    .then((fetchResponse) => {
      response.json(fetchResponse.status);
    })
    .catch((exception) => {
      console.error(exception);
      response.sendStatus(404);
    });
});

app.get("/search", async (request, response, next) => {
  try {
    const catalogues = catalogueDatabase.getAllData();
    const requestedSearch = request.query.input;
    var dataArray = [];
    for (let index = 0; index < catalogues.length; index++) {
      const element = catalogues[index];
      if (element.catalogueAddress.length > 0) {
        const queryToDb = `${element.catalogueAddress}?name=${requestedSearch}`;
        const db_response = await fetch(queryToDb);
        var data = {
          name: element.catalogueName,
          content: await db_response.json(),
        };
        dataArray.push(data);
      } else {
        console.error(
          `Error in catalogueDirectory:catalogueDirectory.js:app.get(/search): ${element.catalogueName} does not have a valid address.`
        );
      }
    }
    response.json(dataArray);
  } catch (error) {
    console.error(
      "Error in catalogueDirectory:catalogueDirectory.js:app.get(/search): ",
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
