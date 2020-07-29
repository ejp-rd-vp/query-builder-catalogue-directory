"use strict";

// load dependencies
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const Datastore = require("nedb");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// define file paths
const DATABASE_PATH = "./database/catalogues.json";
const PRIVATE_KEY_PATH = "./cert/private.key";
const CERTIFICATE_PATH = "./cert/certificate.crt";

// class that holds a NeDB database and its' functionality
exports.Directory = class Directory {
  catalogueDatabase;

  constructor(dataBaseFilename) {
    this.catalogueDatabase = new Datastore(dataBaseFilename);
    this.catalogueDatabase.loadDatabase();
  }

  getDirectory() {
    return this.catalogueDatabase;
  }
};

// class that holds an express application and its' configuration
exports.Application = class Application {
  app;
  catalogueDatabase;
  checkJwt;

  constructor(database) {
    this.app = express();
    this.app.use(helmet());
    this.app.use(morgan("dev"));
    this.app.use(cors());
    this.app.use(
      express.json({
        limit: "1mb",
      })
    );

    this.catalogueDatabase = database;

    this.checkJwt = jwt({
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

    this.app.get("/", (request, response, next) => {
      try {
        response.sendStatus(200);
        return 0;
      } catch (exception) {
        console.error(
          "Error in catalogueDirectory:catalogueDirectory.js:app.get(/): ",
          exception
        );
      }
    });

    exports.getCatalogues = this.app.get(
      "/getCatalogues",
      (request, response, next) => {
        try {
          this.catalogueDatabase.find({}, (err, data) => {
            if (err) {
              response.end();
              return -1;
            }
            response.json(data);
            return 0;
          });
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ",
            exception
          );
        }
      }
    );

    exports.addCatalogues = this.app.post(
      "/addCatalogue",
      (request, response, next) => {
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
                      const timestamp = Date.now();
                      data.timestamp = timestamp;
                      data._id = Math.random()
                        .toString(36)
                        .substr(2, 9)
                        .toUpperCase();
                      this.catalogueDatabase.insert(data);
                      this.catalogueDatabase.persistence.compactDatafile();
                      response.json({
                        status: "success",
                        id: data._id,
                      });
                      return 0;
                    }
                  }
                );
              } else {
                const timestamp = Date.now();
                data.timestamp = timestamp;
                data._id = Math.random()
                  .toString(36)
                  .substr(2, 9)
                  .toUpperCase();
                this.catalogueDatabase.insert(data);
                this.catalogueDatabase.persistence.compactDatafile();
                response.json({
                  status: "success",
                  id: data._id,
                });
                return 0;
              }
            }
          );
        } catch (exception) {
          console.error(
            "Error in catalogueDirectory:catalogueDirectory.js:app.post(/addCatalogue): ",
            exception
          );
        }
      }
    );

    exports.removeCatalogues = this.app.post(
      "/removeCatalogue",
      (request, response, next) => {
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
            "Error in catalogueDirectory:catalogueDirectory.js:app.post(/removeCatalogue): ",
            exception
          );
        }
      }
    );
  }

  getApp() {
    return this.app;
  }
};

// class that holds a http(s) server application and its' configuration
exports.Server = class Server {
  key;
  cert;
  credentials;
  httpServer;
  httpsServer;

  constructor(privateKeyFilename, certificateFilename, app) {
    this.key = fs.readFileSync(privateKeyFilename);
    this.cert = fs.readFileSync(certificateFilename);
    this.credentials = {
      key: this.key,
      cert: this.cert,
    };

    this.run(app);
  }

  getHttpServer() {
    return this.httpServer;
  }

  getHttpsServer() {
    return this.httpsServer;
  }

  run(app) {
    try {
      // parse command line arguments
      let commandLineArguments = process.argv.slice(2);

      // check for proper usage
      if (commandLineArguments.length != 2) {
        console.error("Usage: node catalogueDirectory.js $PORT");
        return;
      } else {
        this.httpServer = http.createServer(app);
        this.httpsServer = https.createServer(this.credentials, app);
        // run the server application
        this.httpServer.listen(commandLineArguments[0], () =>
          console.log(
            `Catalogue Directory listening on http://localhost:${commandLineArguments[0]} ...`
          )
        );
        this.httpsServer.listen(commandLineArguments[1], () =>
          console.log(
            `Catalogue Directory listening on https://localhost:${commandLineArguments[1]} ...`
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
};

let directory = new this.Directory(DATABASE_PATH);
let app = new this.Application(directory.getDirectory());
let server = new this.Server(PRIVATE_KEY_PATH, CERTIFICATE_PATH, app.getApp());
