"use strict";

// loading dependencies
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fetch = require("node-fetch");

// define catalogue directory endpoint
const getCataloguesEndpoint = "http://localhost:3001/getCatalogues";

// define and retrieve catalogue list
let catalogues = getCatalogues();

// define the server application
const app = express();

// add morgan to log HTTP requests
app.use(morgan("dev"));

// add cross origin resource sharing
app.use(cors());

// make static content available
app.use(express.static("./"));

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
      `Portal available at http://${commandLineArguments[0]}:${commandLineArguments[1]} ...`
    )
);

// function that retrieves a catalogue list from the catalogue directory
async function getCatalogues() {
  fetch(getCataloguesEndpoint)
    .then(handleFetchErrors)
    .then(async (fetchResponse) => {
      if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
        const data = await fetchResponse.json();
        catalogues = data;
      }
    })
    .catch((exception) => {
      console.error(exception);
    });
}

// function that handles fetch errors
function handleFetchErrors(response) {
  try {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  } catch (exception) {
    console.error("Error in portal:portal.js:handleFetchErrors()", exception);
  }
}

// add get route that handles a search query
app.get("/search", async (request, response, next) => {
  try {
    const requestedSearch = request.query.input;
    let dataArray = [];
    for (let catalogue of catalogues) {
      if (catalogue.catalogueAddress.length > 0) {
        const queryToDb = `${catalogue.catalogueAddress}?name=${requestedSearch}`;
        const db_response = await fetch(queryToDb);
        var data = {
          name: catalogue.catalogueName,
          content: await db_response.json(),
        };
        dataArray.push(data);
      } else {
        console.error(
          `Error in portal:portal.js:app.get(/search): ${catalogue.catalogueName} does not have a valid address.`
        );
      }
    }
    response.json(dataArray);
  } catch (exception) {
    console.error("Error in portal:portal.js:app.get(/search): ", exception);
  }
});

app.get("/pingCatalogue", async (request, response, next) => {
  try {
    fetch(request.query.address)
      .then(handleFetchErrors)
      .then((fetchResponse) => {
        response.json(fetchResponse.status);
      })
      .catch((exception) => {
        console.error(exception);
        response.sendStatus(404);
      });
  } catch (exception) {
    console.error(
      "Error in portal:portal.js:app.get(/pingCatalogue): ",
      exception
    );
  }
});
