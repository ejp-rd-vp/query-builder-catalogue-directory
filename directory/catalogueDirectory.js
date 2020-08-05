"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.Application = exports.Directory = void 0;
// load dependencies
var express = require("express");
var fs = require("fs");
var http = require("http");
var https = require("https");
var Datastore = require("nedb");
var helmet = require("helmet");
var morgan = require("morgan");
var cors = require("cors");
var jwt = require("express-jwt");
var jwksRsa = require("jwks-rsa");
var dotenv = require("dotenv").config();
var fetch = require("node-fetch");
// define file paths
var DATABASE_PATH = process.env.DATABASE_PATH;
var PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
var CERTIFICATE_PATH = process.env.CERTIFICATE_PATH;
// class that holds a NeDB database and its' functionality
var Directory = /** @class */ (function () {
    function Directory(dataBaseFilename) {
        try {
            this.catalogueDatabase = new Datastore(dataBaseFilename);
            this.catalogueDatabase.loadDatabase();
        }
        catch (exception) {
            console.error("Error in catalogueDirectory:Directory:constructor(): ", exception);
        }
    }
    // class functions
    Directory.prototype.getDirectory = function () {
        try {
            return this.catalogueDatabase;
        }
        catch (exception) {
            console.error("Error in catalogueDirectory:Directory:getDirectory(): ", exception);
        }
    };
    return Directory;
}());
exports.Directory = Directory;
// class that holds an express application and its' configuration
var Application = /** @class */ (function () {
    function Application(database) {
        var _this = this;
        try {
            this.app = express();
            this.catalogueDatabase = database;
            this.checkJwt = jwt({
                secret: jwksRsa.expressJwtSecret({
                    cache: true,
                    rateLimit: true,
                    jwksRequestsPerMinute: 5,
                    jwksUri: "https://dev-luoogqm3.eu.auth0.com/.well-known/jwks.json",
                }),
                // Validate the audience and the issuer.
                audience: "http://express.api",
                issuer: "https://dev-luoogqm3.eu.auth0.com/",
                algorithms: ["RS256"],
            });
            this.app.use(helmet());
            this.app.use(morgan("dev"));
            this.app.use(cors());
            this.app.use(express.static("./public"));
            this.app.use(express.json({
                limit: "1mb",
            }));
            // express routes
            this.app.get("/getCatalogues", function (request, response, next) {
                try {
                    _this.catalogueDatabase.find({}, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ", exception);
                }
            });
            this.app.get("/getCatalogues/biobanks", function (request, response, next) {
                try {
                    _this.catalogueDatabase.find({ catalogueType: "biobank" }, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ", exception);
                }
            });
            this.app.get("/getCatalogues/registries", function (request, response, next) {
                try {
                    _this.catalogueDatabase.find({ catalogueType: "registry" }, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory:catalogueDirectory.js:app.get(/getCatalogues): ", exception);
                }
            });
            // add GET route that handles a ping request
            this.app.get("/pingCatalogue", function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        fetch(request.query.address)
                            .then(this.handleFetchErrors)
                            .then(function (fetchResponse) {
                            if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                                response.json(fetchResponse.status);
                            }
                            else {
                                response.sendStatus(404);
                            }
                        })
                            .catch(function (exception) {
                            console.error(exception);
                            response.sendStatus(404);
                        });
                    }
                    catch (exception) {
                        console.error("Error in portal:portal.js:app.get(/pingCatalogue): ", exception);
                    }
                    return [2 /*return*/];
                });
            }); });
            this.app.use(this.checkJwt);
            this.app.post("/addCatalogue", function (request, response, next) {
                try {
                    var nameExists_1 = Boolean(false);
                    var data_1 = request.body;
                    _this.catalogueDatabase.find({ catalogueName: { $in: [data_1.catalogueName] } }, function (error, records) {
                        if (error) {
                            console.error(error);
                            return -1;
                        }
                        else if (records.length > 0) {
                            nameExists_1 = true;
                            _this.catalogueDatabase.find({ catalogueAddress: { $in: [data_1.catalogueAddress] } }, function (error, records) {
                                if (error) {
                                    console.error(error);
                                }
                                else if (records.length > 0 && nameExists_1) {
                                    response.sendStatus(400);
                                }
                                else {
                                    var created = Date.now();
                                    data_1.created = created;
                                    data_1._id = Math.random()
                                        .toString(36)
                                        .substr(2, 9)
                                        .toUpperCase();
                                    _this.catalogueDatabase.insert(data_1);
                                    _this.catalogueDatabase.persistence.compactDatafile();
                                    response.json({
                                        status: "success",
                                        id: data_1._id,
                                    });
                                    return 0;
                                }
                            });
                        }
                        else {
                            var created = Date.now();
                            data_1.created = created;
                            data_1._id = Math.random()
                                .toString(36)
                                .substr(2, 9)
                                .toUpperCase();
                            _this.catalogueDatabase.insert(data_1);
                            _this.catalogueDatabase.persistence.compactDatafile();
                            response.json({
                                status: "success",
                                id: data_1._id,
                            });
                            return 0;
                        }
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory:catalogueDirectory.js:app.post(/addCatalogue): ", exception);
                }
            });
            this.app.post("/removeCatalogue", function (request, response, next) {
                try {
                    var data_2 = request.body;
                    _this.catalogueDatabase.find({ _id: { $in: [data_2.catalogueID] } }, function (error, docs) {
                        if (error) {
                            console.error(error);
                            return -1;
                        }
                        else if (!docs.length) {
                            response.sendStatus(404);
                            return 404;
                        }
                        else {
                            _this.catalogueDatabase.remove({ _id: data_2.catalogueID }, {}, function (error) {
                                if (error) {
                                    console.error(error);
                                    return -1;
                                }
                                else {
                                    _this.catalogueDatabase.persistence.compactDatafile();
                                    response.json({
                                        status: "success",
                                    });
                                    return 0;
                                }
                            });
                        }
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory:catalogueDirectory.js:app.post(/removeCatalogue): ", exception);
                }
            });
        }
        catch (exception) {
            console.error("Error in catalogueDirectory:Application:constructor(): ", exception);
        }
    }
    // class functions
    Application.prototype.handleFetchErrors = function (fetchResponse) {
        try {
            if (!fetchResponse.ok) {
                console.error("Fetch Error: " +
                    fetchResponse.status +
                    " " +
                    fetchResponse.statusText);
            }
            return fetchResponse;
        }
        catch (exception) {
            console.error("Error in clientScripts.js:handleFetchErrors(): ", exception);
        }
    };
    Application.prototype.getApp = function () {
        try {
            return this.app;
        }
        catch (exception) {
            console.error("Error in catalogueDirectory:Application:getApp(): ", exception);
        }
    };
    return Application;
}());
exports.Application = Application;
// class that holds a http(s) server application and its' configuration
var Server = /** @class */ (function () {
    function Server(privateKeyFilename, certificateFilename) {
        this.key = fs.readFileSync(privateKeyFilename);
        this.cert = fs.readFileSync(certificateFilename);
        this.credentials = {
            key: this.key,
            cert: this.cert,
        };
    }
    // class functions
    Server.prototype.getHttpServer = function () {
        return this.httpServer;
    };
    Server.prototype.getHttpsServer = function () {
        return this.httpsServer;
    };
    Server.prototype.run = function (app) {
        try {
            // parse command line arguments
            var commandLineArguments_1 = process.argv.slice(2);
            // check for proper usage
            if (commandLineArguments_1.length != 2) {
                console.error("Usage: node catalogueDirectory.js $HTTP_PORT $HTTPS_PORT");
                return;
            }
            else {
                this.httpServer = http.createServer(app.getApp());
                this.httpsServer = https.createServer(this.credentials, app.getApp());
                // run the server application
                this.httpServer.listen(commandLineArguments_1[0], function () {
                    return console.log("Catalogue Directory listening on http://localhost:" + commandLineArguments_1[0] + " ...");
                });
                this.httpsServer.listen(commandLineArguments_1[1], function () {
                    return console.log("Catalogue Directory listening on https://localhost:" + commandLineArguments_1[1] + " ...");
                });
            }
        }
        catch (exception) {
            console.error("Error in catalogueDirectory:catalogueDirectory.js:Server:run(): ", exception);
        }
    };
    return Server;
}());
exports.Server = Server;
// create components
var directory = new Directory(DATABASE_PATH);
var app = new Application(directory.getDirectory());
var server = new Server(PRIVATE_KEY_PATH, CERTIFICATE_PATH);
server.run(app);
