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
// define API endpoint addresses
var catalogueDirectoryAddress = window.location.origin;
var getCataloguesEndpoint = catalogueDirectoryAddress + "/catalogues";
var addCatalogueEndpoint = catalogueDirectoryAddress + "/addCatalogue";
var removeCatalogueEndpoint = catalogueDirectoryAddress + "/removeCatalogue";
var pingEndpoint = catalogueDirectoryAddress + "/pingCatalogue";
// global variables
var catalogues;
// html components
var statusText = document.getElementById("statusText");
var catalogueNameInput = document.getElementById("catalogueName");
var catalogueAddressInput = document.getElementById("catalogueAddress");
var registryCheckboxInput = document.getElementById("registryCheckbox");
var catalogueDescriptionInput = document.getElementById("catalogueDescription");
var biobankCheckboxInput = document.getElementById("biobankCheckbox");
var catalogueIDInput = document.getElementById("catalogueID");
var catalogueList = document.getElementById("catalogueList");
// function that handles fetch errors
function handleFetchErrors(fetchResponse) {
    try {
        if (!fetchResponse.ok) {
            console.error("Fetch Error: " + fetchResponse.status + " " + fetchResponse.statusText);
        }
        return fetchResponse;
    }
    catch (exception) {
        console.error("Error in clientScripts.js:handleFetchErrors(): ", exception);
    }
}
// function that checks for a valid url string
function isValidUrl(url) {
    try {
        new URL(url);
    }
    catch (exception) {
        console.error("Error in clientScripts.js:isValidUrl(): ", exception);
        return false;
    }
    return true;
}
// function that indicates input elements that are responsible for errors
function colorInputFields(inputField, color) {
    try {
        var input = document.getElementById(inputField);
        switch (color) {
            case "red": {
                input.style.borderColor = "firebrick";
                break;
            }
            case "black": {
                input.style.borderColor = "black";
                break;
            }
            default: {
                console.log("Entering default switch of clientScripts.js:colorInputFields().");
            }
        }
    }
    catch (exception) {
        console.error("Error in clientScripts.js:colorInputFields(): ", exception);
    }
}
// function that clears the users' input
function clearInput(inputField) {
    try {
        if (inputField == "all") {
            catalogueNameInput.value = "";
            catalogueAddressInput.value = "";
            catalogueDescriptionInput.value = "";
            registryCheckboxInput.checked = false;
            biobankCheckboxInput.checked = false;
        }
        else {
            var input = document.getElementById(inputField);
            input.value = "";
        }
    }
    catch (exception) {
        console.error("Error in clientScripts.js:clearInput(): ", exception);
    }
}
// function that gets the users' input
function getUserInput(useCase) {
    try {
        switch (useCase) {
            case "add": {
                var data = {
                    catalogueName: "",
                    catalogueAddress: "",
                    catalogueDescription: "",
                    catalogueType: []
                };
                if (catalogueNameInput.value.length > 0 &&
                    catalogueAddressInput.value.length > 0 &&
                    (registryCheckboxInput.checked || biobankCheckboxInput.checked) &&
                    catalogueDescriptionInput.value.length > 0) {
                    if (isValidUrl(catalogueAddressInput.value)) {
                        // get user input
                        data.catalogueName = catalogueNameInput.value;
                        if (catalogueAddressInput.value[catalogueAddressInput.value.length - 1] == "/") {
                            data.catalogueAddress = catalogueAddressInput.value.slice(0, -1);
                        }
                        else {
                            data.catalogueAddress = catalogueAddressInput.value;
                        }
                        data.catalogueDescription = catalogueDescriptionInput.value;
                        if (registryCheckboxInput.checked) {
                            data.catalogueType.push("registry");
                        }
                        if (biobankCheckboxInput.checked) {
                            data.catalogueType.push("biobank");
                        }
                        colorInputFields("catalogueDescription", "black");
                        colorInputFields("catalogueAddress", "black");
                        colorInputFields("catalogueName", "black");
                        return data;
                    }
                    else {
                        updateStatusText("error", "Catalogue address must be a valid URL.");
                        colorInputFields("catalogueDescription", "black");
                        colorInputFields("catalogueName", "black");
                        colorInputFields("catalogueAddress", "red");
                        clearInput("catalogueAddress");
                        return undefined;
                    }
                }
                else {
                    updateStatusText("error", "Catalogue name, address, type and description must not be empty.");
                    colorInputFields("catalogueDescription", "red");
                    colorInputFields("catalogueName", "red");
                    colorInputFields("catalogueAddress", "red");
                    return undefined;
                }
            }
            default: {
                console.log("Entering default switch of clientScripts.js:getUserInput().");
            }
        }
    }
    catch (exception) {
        console.error("Error in clientScripts.js:getUserInput(): ", exception);
    }
}
// function that updates the DOM
function updateStatusText(type, message) {
    try {
        switch (type) {
            case "success": {
                statusText.style.border = "1px solid forestgreen";
                statusText.textContent = message;
                break;
            }
            case "error": {
                statusText.style.border = "1px solid firebrick";
                statusText.textContent = message;
                break;
            }
            default: {
                console.log("Entering default switch of clientScripts.js:updateStatusText().");
            }
        }
    }
    catch (exception) {
        console.error("Error in clientScripts.js:updateStatusText(): ", exception);
    }
}
// function that handles the catalogue list visibility
function toggleCatalogueListVisibility() {
    try {
        var button = document.getElementById("showCataloguesButton");
        if (catalogueList.style.display === "none") {
            button.value = "Hide Catalogues";
            catalogueList.style.display = "block";
        }
        else {
            button.value = "Show Catalogues";
            catalogueList.style.display = "none";
        }
    }
    catch (exception) {
        console.error("Error in clientScripts.js:toggleCatalogueListVisibility(): ", exception);
    }
}
function updateCatalogueListDOM(catalogue, fetchResponse) {
    try {
        var catalogueID = catalogue._id;
        var entry = document.createElement("DIV");
        entry.style.marginBottom = "15px";
        var trashIcon = document.createElement("IMG");
        trashIcon.setAttribute("src", "media/trash.png");
        trashIcon.setAttribute("alt", "trash-icon");
        trashIcon.setAttribute("onclick", "removeCatalogue(" + catalogueID + ")");
        trashIcon.style.float = "right";
        trashIcon.style.cursor = "pointer";
        entry.appendChild(trashIcon);
        if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
            var connectedIcon = document.createElement("IMG");
            connectedIcon.setAttribute("src", "media/connected.png");
            connectedIcon.setAttribute("alt", "connected-icon");
            entry.appendChild(connectedIcon);
        }
        else {
            var disconnectedIcon = document.createElement("IMG");
            disconnectedIcon.setAttribute("src", "media/disconnected.png");
            disconnectedIcon.setAttribute("alt", "disconnected-icon");
            entry.appendChild(disconnectedIcon);
        }
        var catalogueName = document.createElement("SPAN");
        catalogueName.style.fontSize = "18px";
        catalogueName.style.position = "absolute";
        catalogueName.style.marginLeft = "20px";
        catalogueName.textContent = catalogue.catalogueName;
        if (catalogue.catalogueType.includes("registry")) {
            var registryIcon = document.createElement("IMG");
            registryIcon.setAttribute("src", "media/registry-icon.png");
            registryIcon.setAttribute("alt", "registry-icon");
            registryIcon.style.marginLeft = "10px";
            catalogueName.appendChild(registryIcon);
        }
        if (catalogue.catalogueType.includes("biobank")) {
            var biobankIcon = document.createElement("IMG");
            biobankIcon.setAttribute("src", "media/biobank-icon.png");
            biobankIcon.setAttribute("alt", "biobank-icon");
            biobankIcon.style.marginLeft = "10px";
            catalogueName.appendChild(biobankIcon);
        }
        catalogueName.appendChild(document.createElement("br"));
        var catalogueDescription = document.createElement("SPAN");
        catalogueDescription.style.fontSize = "15px";
        catalogueDescription.style.position = "absolute";
        catalogueDescription.textContent = catalogue.catalogueDescription;
        catalogueName.appendChild(catalogueDescription);
        entry.appendChild(catalogueName);
        catalogueList.appendChild(entry);
    }
    catch (exception) {
        console.error("Error in clientScripts.js:updateCatalogueListDOM(): ", exception);
    }
}
// function that updates the catalogue list DOM element
function updateCatalogueList() {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, catalogues_1, catalogue;
        return __generator(this, function (_a) {
            try {
                catalogueList.textContent = "";
                _loop_1 = function (catalogue) {
                    fetch(pingEndpoint + "?address=" + catalogue.catalogueAddress)
                        .then(handleFetchErrors)
                        .then(function (fetchResponse) {
                        updateCatalogueListDOM(catalogue, fetchResponse);
                    })["catch"](function (exception) {
                        return console.error("Error in clientScripts.js:updateCatalogueList():fetch(): ", exception);
                    });
                };
                for (_i = 0, catalogues_1 = catalogues; _i < catalogues_1.length; _i++) {
                    catalogue = catalogues_1[_i];
                    _loop_1(catalogue);
                }
            }
            catch (exception) {
                console.error("Error in clientScripts.js:updateCatalogueList(): ", exception);
            }
            return [2 /*return*/];
        });
    });
}
// function that adds a new catalogue to the catalogue directory
function addCatalogue() {
    return __awaiter(this, void 0, void 0, function () {
        var postMessage_1, newCatalogueData_1, exception_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    postMessage_1 = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: ""
                    };
                    if (!(getUserInput("add") != undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getUserInput("add")];
                case 1:
                    newCatalogueData_1 = _a.sent();
                    clearInput("all");
                    // parse inserted data into POST body
                    postMessage_1.body = JSON.stringify(newCatalogueData_1);
                    // test if the address to be added is responding
                    fetch(pingEndpoint + "?address=" + newCatalogueData_1.catalogueAddress)
                        .then(handleFetchErrors)
                        .then(function (fetchResponse) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            // send post request
                            if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                                fetch(addCatalogueEndpoint, postMessage_1)
                                    .then(handleFetchErrors)
                                    .then(function (fetchResponse) { return __awaiter(_this, void 0, void 0, function () {
                                    var fetchResponseData;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(fetchResponse.status >= 200 && fetchResponse.status < 400)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, fetchResponse.json()];
                                            case 1:
                                                fetchResponseData = _a.sent();
                                                updateStatusText("success", "Catalogue " + newCatalogueData_1.catalogueName + " successfully added using ID " + fetchResponseData.id + ".");
                                                getCatalogues();
                                                return [3 /*break*/, 3];
                                            case 2:
                                                if (fetchResponse.status == 400) {
                                                    updateStatusText("error", "Catalogue already exists.");
                                                }
                                                else {
                                                    updateStatusText("error", "Catalogue could not be added.");
                                                }
                                                _a.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); })["catch"](function (exception) {
                                    return console.error("Error in clientScripts.js:addCatalogue():fetch(): ", exception);
                                });
                            }
                            else {
                                updateStatusText("error", "The entered URL is not accessible.");
                                clearInput("catalogueAddress");
                            }
                            return [2 /*return*/];
                        });
                    }); })["catch"](function (exception) {
                        return console.error("Error in clientScripts.js:addCatalogue():fetch(): ", exception);
                    });
                    return [3 /*break*/, 3];
                case 2:
                    console.error("Error in portal:scripts.js:addCatalogue(): User input is invalid.");
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    exception_1 = _a.sent();
                    console.error("Error in clientScripts.js:addCatalogue(): ", exception_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// function that removes a new catalogue from the catalogue directory
function removeCatalogue(id) {
    return __awaiter(this, void 0, void 0, function () {
        var postMessage_2, data;
        return __generator(this, function (_a) {
            try {
                postMessage_2 = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: ""
                };
                data = { catalogueID: "" };
                data.catalogueID = id;
                postMessage_2.body = JSON.stringify(data);
                // send post request
                fetch(removeCatalogueEndpoint, postMessage_2)
                    .then(handleFetchErrors)
                    .then(function (fetchResponse) {
                    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                        updateStatusText("success", "Successfully removed catalogue using ID " + id + ".");
                        getCatalogues();
                    }
                    else if (fetchResponse.status == 404) {
                        updateStatusText("error", "Could not find a catalogue using ID " + id + ".");
                    }
                    else if (fetchResponse.status == 401) {
                        updateStatusText("error", "You are not authorized to remove this catalogue.");
                    }
                    else {
                        updateStatusText("error", "Could not remove this catalogue.");
                    }
                })["catch"](function (exception) {
                    return console.error("Error in clientScripts.js:removeCatalogue():fetch():", exception);
                });
            }
            catch (exception) {
                console.error("Error in clientScripts.js:removeCatalogue(): ", exception);
            }
            return [2 /*return*/];
        });
    });
}
// function that queries all catalogues from the catalogue directory
function getCatalogues() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            try {
                fetch(getCataloguesEndpoint)
                    .then(handleFetchErrors)
                    .then(function (fetchResponse) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(fetchResponse.status >= 200 && fetchResponse.status < 400)) return [3 /*break*/, 2];
                                return [4 /*yield*/, fetchResponse.json()];
                            case 1:
                                data = _a.sent();
                                catalogues = data;
                                updateCatalogueList();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (exception) {
                    console.error(exception);
                });
            }
            catch (exception) {
                console.error("Error in clientScripts.js:getCatalogues() ", exception);
            }
            return [2 /*return*/];
        });
    });
}
