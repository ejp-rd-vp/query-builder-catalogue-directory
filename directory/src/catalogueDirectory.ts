"use strict";

export {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// load dependencies
const express = require("express");
const Datastore = require("nedb");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const fetch = require("node-fetch");

// define database file path
const DATABASE_PATH: string = process.env.DATABASE_PATH;

// class that holds data of a catalogue
class Catalogue {
  constructor(
    name: string,
    address: string,
    description: string,
    type: Array<string>,
    id: string
  ) {
    this.catalogueName = name;
    this.catalogueAddress = address;
    this.catalogueDescription = description;
    this.catalogueType = type;
    this._id = id;
    this.created = Date.now();
  }

  catalogueName: string;
  catalogueAddress: string;
  catalogueDescription: string;
  catalogueType: Array<string>;
  _id: string;
  created;
}

// class that holds a NeDB database and its' functionality
class Directory {
  constructor(dataBaseFilename: string) {
    try {
      this.catalogueDatabase = new Datastore(dataBaseFilename);
      this.catalogueDatabase.loadDatabase();
    } catch (exception) {
      console.error(
        "Error in catalogueDirectory.ts:Directory:constructor(): ",
        exception
      );
    }
  }

  // class attributes
  catalogueDatabase;

  // class functions
  getDirectory() {
    try {
      return this.catalogueDatabase;
    } catch (exception) {
      console.error(
        "Error in catalogueDirectory:Directory:getDirectory(): ",
        exception
      );
    }
  }
}

// class that holds an express application and its' configuration
class Application {
  constructor(database: Directory) {
    try {
      this.app = express();
      this.app.use(helmet());
      this.app.use(morgan("dev"));
      this.app.use(cors());
      this.app.use("/ui", express.static("./public"));
      this.app.use(
        express.json({
          limit: "100kb",
        })
      );

      this.catalogueDatabase = database.getDirectory();
      this.catalogueDatabase.ensureIndex({ fieldName: "_id", unique: true });

      /*** Express Routes ***/
      // get information about the API
      this.app.get("/", (request, response, next) => {
        try {
          response.json({
            name: "EJP-RD Central Catalogue REST API.",
            description:
              "The EJP-RD Central Catalogue REST API can be used to fetch, add and remove catalogue addresses via HTTP requests.",
            usage:
              "Please refer to https://github.com/ejp-rd-vp/query-builder-catalogue-directory for more information on usage.",
            apiVersion: "v0.1",
          });
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/getCatalogues): ",
            exception
          );
        }
      });

      // get a list of all catalogues
      this.app.get("/catalogues", (request, response, next) => {
        try {
          this.catalogueDatabase.find({}, (err, data) => {
            if (err) {
              response.end();
            }
            response.json(data);
          });
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/getCatalogues): ",
            exception
          );
        }
      });

      // get a list of all biobanks
      this.app.get("/catalogues/biobanks", (request, response, next) => {
        try {
          this.catalogueDatabase.find(
            { catalogueType: "biobank" },
            (err, data) => {
              if (err) {
                response.end();
              }
              response.json(data);
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/getCatalogues/biobanks): ",
            exception
          );
        }
      });

      // get a list of all registries
      this.app.get("/catalogues/registries", (request, response, next) => {
        try {
          this.catalogueDatabase.find(
            { catalogueType: "registry" },
            (err, data) => {
              if (err) {
                response.end();
              }
              response.json(data);
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/getCatalogues/registries): ",
            exception
          );
        }
      });

      // get a certain catalogue by ID (path)
      this.app.get("/catalogues/:id", (request, response, next) => {
        try {
          this.catalogueDatabase.find(
            { _id: request.params.id },
            (err, data) => {
              if (err) {
                response.end();
              }
              response.json(data);
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/getCatalogues): ",
            exception
          );
        }
      });

      // ping the address of a certain catalogue
      this.app.get("/pingCatalogue", async (request, response, next) => {
        try {
          fetch(request.query.address)
            .then(this.handleFetchErrors)
            .then((fetchResponse) => {
              if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                response.json(fetchResponse.status);
              } else {
                response.sendStatus(404);
              }
            })
            .catch((exception) => {
              console.error(exception);
              response.sendStatus(404);
            });
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.get(/pingCatalogue): ",
            exception
          );
        }
      });

      // add a new catalogue
      this.app.post("/addCatalogue", (request, response, next) => {
        try {
          let nameExists = Boolean(false);
          const data = request.body;

          this.catalogueDatabase.find(
            { catalogueName: { $in: [data.catalogueName] } },
            (error, records) => {
              if (error) {
                console.error(error);
                return -1;
              } else if (records.length > 0) {
                nameExists = true;
                this.catalogueDatabase.find(
                  { catalogueAddress: { $in: [data.catalogueAddress] } },
                  (error, records) => {
                    if (error) {
                      console.error(error);
                    } else if (records.length > 0 && nameExists) {
                      response.sendStatus(400);
                    } else {
                      let id = Math.random().toString().substr(2, 9);
                      let catalogue = new Catalogue(
                        data.catalogueName,
                        data.catalogueAddress,
                        data.catalogueDescription,
                        data.catalogueType,
                        id
                      );
                      this.catalogueDatabase.insert(catalogue);
                      this.catalogueDatabase.persistence.compactDatafile();
                      response.json({
                        status: "success",
                        id: catalogue._id,
                      });
                      return 0;
                    }
                  }
                );
              } else {
                let id = Math.random().toString().substr(2, 9);
                let catalogue = new Catalogue(
                  data.catalogueName,
                  data.catalogueAddress,
                  data.catalogueDescription,
                  data.catalogueType,
                  id
                );
                this.catalogueDatabase.insert(catalogue);
                this.catalogueDatabase.persistence.compactDatafile();
                response.json({
                  status: "success",
                  id: catalogue._id,
                });
                return 0;
              }
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.post(/addCatalogue): ",
            exception
          );
        }
      });

      // remove a certain catalogue using its' id
      this.app.post("/removeCatalogue", (request, response, next) => {
        try {
          const data = request.body;
          this.catalogueDatabase.find(
            { _id: { $in: [data.catalogueID] } },
            (error, docs) => {
              if (error) {
                console.error(error);
                return -1;
              } else if (!docs.length) {
                response.sendStatus(404);
                return 404;
              } else {
                this.catalogueDatabase.remove(
                  { _id: data.catalogueID },
                  {},
                  (error) => {
                    if (error) {
                      console.error(error);
                      return -1;
                    } else {
                      this.catalogueDatabase.persistence.compactDatafile();
                      response.json({
                        status: "success",
                      });
                      return 0;
                    }
                  }
                );
              }
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory.ts:Application:constructor():app.post(/removeCatalogue): ",
            exception
          );
        }
      });
    } catch (exception) {
      console.error(
        "Error in catalogueDirectory.ts:Application:constructor(): ",
        exception
      );
    }
  }

  // class attributes
  app;
  catalogueDatabase;

  // class functions
  handleFetchErrors(fetchResponse) {
    try {
      if (!fetchResponse.ok) {
        console.error(
          "Fetch Error: " +
            fetchResponse.status +
            " " +
            fetchResponse.statusText
        );
      }

      return fetchResponse;
    } catch (exception) {
      console.error(
        "Error in catalogueDirectory.ts:Application:handleFetchErrors(): ",
        exception
      );
    }
  }

  getApp() {
    try {
      return this.app;
    } catch (exception) {
      console.error(
        "Error in catalogueDirectory.ts:Application:getApp(): ",
        exception
      );
    }
  }
}

// class that holds a http server application and its' configuration
class Server {
  // class functions
  run(app: Application) {
    try {
      // parse command line arguments
      let commandLineArguments = process.argv.slice(2);

      // check for proper usage
      if (commandLineArguments.length != 1) {
        console.error("Usage: node catalogueDirectory.js $HTTP_PORT");
        return;
      } else {
        // run the server application
        app
          .getApp()
          .listen(commandLineArguments[0], () =>
            console.log(
              `Catalogue Directory listening on http://localhost:${commandLineArguments[0]} ...`
            )
          );
      }
    } catch (exception) {
      console.error("Error in catalogueDirectory.ts:Server:run(): ", exception);
    }
  }
}

// create components
const directory = new Directory(DATABASE_PATH);
const app = new Application(directory);
const server = new Server();

server.run(app);
