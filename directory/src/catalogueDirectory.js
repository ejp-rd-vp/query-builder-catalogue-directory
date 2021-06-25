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
exports.__esModule = true;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// load dependencies
var express = require("express");
var Datastore = require("nedb");
var helmet = require("helmet");
var morgan = require("morgan");
var cors = require("cors");
var dotenv = require("dotenv").config();
var fetch = require("node-fetch");
// define database file path
var DATABASE_PATH = process.env.DATABASE_PATH;
// class that holds data of a catalogue
var Catalogue = /** @class */ (function () {
    function Catalogue(name, address, description, type, id) {
        this.catalogueName = name;
        this.catalogueAddress = address;
        this.catalogueDescription = description;
        this.catalogueType = type;
        this._id = id;
    }
    return Catalogue;
}());
// class that holds a NeDB database and its' functionality
var Directory = /** @class */ (function () {
    function Directory(dataBaseFilename) {
        try {
            this.catalogueDatabase = new Datastore({
                filename: dataBaseFilename,
                autoload: true,
                timestampData: true,
                corruptAlertThreshold: 1
            });
        }
        catch (exception) {
            console.error("Error in catalogueDirectory.ts:Directory:constructor(): ", exception);
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
// class that holds an express application and its' configuration
var Application = /** @class */ (function () {
    function Application(database) {
        var _this = this;
        try {
            this.app = express();
            this.app.use(helmet());
            this.app.use(morgan("dev"));
            this.app.use(cors({ origin: 'http://localhost:3001' }));
            this.app.use("/ui", express.static("./public"));
            this.app.use(express.json({
                limit: "100kb"
            }));
            this.catalogueDatabase = database.getDirectory();
            /*** Express Routes ***/
            // get information about the API
            this.app.get("/", function (request, response) {
                try {
                    response.json({
                        name: "EJP-RD Catalogue Directory REST API.",
                        description: "The EJP-RD Catalogue Directory REST API can be used to fetch, add and remove catalogue addresses via HTTP requests.",
                        usage: "/catalogues will return a list of all listed catalogues, /catalogues/biobanks will return a list of all listed biobank catalogues, /catalogues/registries will return a list of all listed registry catalogues, /catalogues/{id} will return the catalogue with the specified {id}.",
                        apiVersion: "v0.1"
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/): ", exception);
                }
            });
            // get a list of all catalogues
            this.app.get("/catalogues", function (request, response) {
                try {
                    _this.catalogueDatabase.find({}, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/catalogues): ", exception);
                }
            });
            // get a list of all biobanks
            this.app.get("/catalogues/biobanks", function (request, response) {
                try {
                    _this.catalogueDatabase.find({ catalogueType: "biobank" }, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/catalogues/biobanks): ", exception);
                }
            });
            // get a list of all registries
            this.app.get("/catalogues/registries", function (request, response) {
                try {
                    _this.catalogueDatabase.find({ catalogueType: "registry" }, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/catalogues/registries): ", exception);
                }
            });
            // get a certain catalogue by ID (path)
            this.app.get("/catalogues/:id", function (request, response) {
                try {
                    _this.catalogueDatabase.find({ _id: request.params.id }, function (err, data) {
                        if (err) {
                            response.end();
                        }
                        response.json(data);
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/catalogues/:id): ", exception);
                }
            });
            // ping the address of a certain catalogue
            this.app.get("/pingCatalogue", function (request, response) { return __awaiter(_this, void 0, void 0, function () {
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
                        })["catch"](function (exception) {
                            console.error(exception);
                            response.sendStatus(404);
                        });
                    }
                    catch (exception) {
                        console.error("Error in catalogueDirectory.ts:Application:constructor():app.get(/pingCatalogue): ", exception);
                    }
                    return [2 /*return*/];
                });
            }); });
            // add a new catalogue
            this.app.post("/addCatalogue", function (request, response) {
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
                                    var id = Math.random().toString().substr(2, 9);
                                    var catalogue = new Catalogue(data_1.catalogueName, data_1.catalogueAddress, data_1.catalogueDescription, data_1.catalogueType, id);
                                    _this.catalogueDatabase.insert(catalogue);
                                    _this.catalogueDatabase.persistence.compactDatafile();
                                    response.json({
                                        status: "success",
                                        id: catalogue._id
                                    });
                                    return 0;
                                }
                            });
                        }
                        else {
                            var id = Math.random().toString().substr(2, 9);
                            var catalogue = new Catalogue(data_1.catalogueName, data_1.catalogueAddress, data_1.catalogueDescription, data_1.catalogueType, id);
                            _this.catalogueDatabase.insert(catalogue);
                            _this.catalogueDatabase.persistence.compactDatafile();
                            response.json({
                                status: "success",
                                id: catalogue._id
                            });
                            return 0;
                        }
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.post(/addCatalogue): ", exception);
                }
            });
            // remove a certain catalogue using its' id
            this.app.post("/removeCatalogue", function (request, response) {
                try {
                    var data_2 = request.body;
                    console.log(data_2);
                    _this.catalogueDatabase.find({ _id: { $in: [data_2.catalogueID] } }, function (error, results) {
                        if (error) {
                            console.error(error);
                            return -1;
                        }
                        else if (!results.length) {
                            response.sendStatus(404);
                            return -1;
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
                                        status: "success"
                                    });
                                    return 0;
                                }
                            });
                        }
                    });
                }
                catch (exception) {
                    console.error("Error in catalogueDirectory.ts:Application:constructor():app.post(/removeCatalogue): ", exception);
                }
            });
        }
        catch (exception) {
            console.error("Error in catalogueDirectory.ts:Application:constructor(): ", exception);
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
            console.error("Error in catalogueDirectory.ts:Application:handleFetchErrors(): ", exception);
        }
    };
    Application.prototype.getApp = function () {
        try {
            return this.app;
        }
        catch (exception) {
            console.error("Error in catalogueDirectory.ts:Application:getApp(): ", exception);
        }
    };
    return Application;
}());
// class that holds a http server application and its' configuration
var Server = /** @class */ (function () {
    function Server() {
    }
    // class functions
    Server.prototype.run = function (app) {
        try {
            // parse command line arguments
            var commandLineArguments_1 = process.argv.slice(2);
            // check for proper usage
            if (commandLineArguments_1.length != 1) {
                console.error("Usage: node catalogueDirectory.js $HTTP_PORT");
                return;
            }
            else {
                // run the server application
                app
                    .getApp()
                    .listen(commandLineArguments_1[0], function () {
                    return console.log("Catalogue Directory listening on http://localhost:" + commandLineArguments_1[0] + " ...");
                });
            }
        }
        catch (exception) {
            console.error("Error in catalogueDirectory.ts:Server:run(): ", exception);
        }
    };
    return Server;
}());
// create components
var directory = new Directory(DATABASE_PATH);
var app = new Application(directory);
var server = new Server();
server.run(app);
