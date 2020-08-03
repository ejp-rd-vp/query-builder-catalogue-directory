"use strict";

// define API endpoint addresses
const catalogueDirectoryAddress = window.location.origin;
const getCataloguesEndpoint = catalogueDirectoryAddress + "/getCatalogues";
const addCatalogueEndpoint = catalogueDirectoryAddress + "/addCatalogue";
const removeCatalogueEndpoint = catalogueDirectoryAddress + "/removeCatalogue";
const pingEndpoint = catalogueDirectoryAddress + "/pingCatalogue";

// define authentication token
const JSONWebToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkQxclRNYWVqMVR6SXZFczVBWDg0UCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sdW9vZ3FtMy5ldS5hdXRoMC5jb20vIiwic3ViIjoiaVlwakU1N2J6T3F0eVVqRGpUQkVBRmZ4VWV4SzhQR2pAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9leHByZXNzLmFwaSIsImlhdCI6MTU5NjQ0MTA1OCwiZXhwIjoxNTk2NTI3NDU4LCJhenAiOiJpWXBqRTU3YnpPcXR5VWpEalRCRUFGZnhVZXhLOFBHaiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.tQb6AaoDfYZ3UbGgCg60sSD1Ub40hYLwqGsHmkGsDjDmEjka9wjWAoARI1TWrnxgH3x1ZWzvbQZugLePcadRGe1lCFIXfP7CGziBgJmE_2vMm_KHypT8mzb94L4BmHAOQtaDmlo6QRvehVkWVvruWlAWV5PEbABj9QQD7g_L0ZPeAUd3joCbPIcRw6rXMEX6IOLfCXiXe390fdVn_8_KUM1wtu5mW62_Wk5zCODeftl10NhxM1WwTHhJnsB6kGawjT29XBiJU693IsIvtWgW7NOPPTnqFp72uKgNu5ppPCmLTRNI3SYocKUfHgdpyWN1pSQ1pH0hiBfpLPXj5vFWoA";

// global variables
let catalogues;

// html components
const statusText = document.getElementById("statusText");
const catalogueNameInput = document.getElementById("catalogueName");
const catalogueAddressInput = document.getElementById("catalogueAddress");
const registryCheckboxInput = document.getElementById("registryCheckbox");
const biobankCheckboxInput = document.getElementById("biobankCheckbox");
const catalogueIDInput = document.getElementById("catalogueID");
const catalogueList = document.getElementById("catalogueList");

// function that handles fetch errors
function handleFetchErrors(fetchResponse) {
  try {
    if (!fetchResponse.ok) {
      console.error(
        "Fetch Error: " + fetchResponse.status + " " + fetchResponse.statusText
      );
    }

    return fetchResponse;
  } catch (exception) {
    console.error("Error in clientScripts.js:handleFetchErrors(): ", exception);
  }
}

// function that checks for a valid url string
function isValidUrl(url) {
  try {
    new URL(url);
  } catch (exception) {
    console.error("Error in clientScripts.js:isValidUrl(): ", exception);
    return false;
  }

  return true;
}

// function that indicates input elements that are responsible for errors
function colorInputFields(inputField, color) {
  try {
    const input = document.getElementById(inputField);

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
        console.log(
          "Entering default switch of clientScripts.js:colorInputFields()."
        );
      }
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:colorInputFields(): ", exception);
  }
}

// function that clears the users' input
function clearInput(useCase) {
  try {
    switch (useCase) {
      case "add": {
        catalogueNameInput.value = "";
        catalogueAddressInput.value = "";
        registryCheckbox.checked = false;
        biobankCheckbox.checked = false;
        break;
      }
      case "remove": {
        catalogueIDInput.value = "";
        break;
      }
      case "search": {
        searchInput.value = "";
        break;
      }
      default: {
        console.log(
          "Entering default switch of clientScripts.js:clearInput()."
        );
      }
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:clearInput(): ", exception);
  }
}

// function that gets the users' input
function getUserInput(useCase) {
  try {
    switch (useCase) {
      case "add": {
        let data = {
          catalogueName: "",
          catalogueAddress: "",
          catalogueType: [],
        };

        if (
          catalogueNameInput.value.length > 0 &&
          catalogueAddressInput.value.length > 0 &&
          (registryCheckboxInput.checked || biobankCheckboxInput.checked)
        ) {
          if (isValidUrl(catalogueAddressInput.value)) {
            // get user input
            data.catalogueName = catalogueNameInput.value;
            data.catalogueAddress = catalogueAddressInput.value;
            if (registryCheckboxInput.checked) {
              data.catalogueType.push("registry");
            }
            if (biobankCheckboxInput.checked) {
              data.catalogueType.push("biobank");
            }

            colorInputFields("catalogueAddress", "black");
            colorInputFields("catalogueName", "black");
            colorInputFields("catalogueID", "black");

            return data;
          } else {
            updateStatusText("error", "Catalogue address must be a valid URL.");

            colorInputFields("catalogueAddress", "red");
            colorInputFields("catalogueID", "black");
            clearInput("add");

            return undefined;
          }
        } else {
          updateStatusText(
            "error",
            "Catalogue name, address and type must not be empty."
          );

          colorInputFields("catalogueName", "red");
          colorInputFields("catalogueAddress", "red");
          colorInputFields("catalogueID", "black");
          clearInput("add");

          return undefined;
        }
      }
      case "remove": {
        let data = {
          catalogueID: "",
        };

        if (catalogueIDInput.value.length > 0) {
          data.catalogueID = catalogueIDInput.value;

          colorInputFields("catalogueID", "black");
          colorInputFields("catalogueName", "black");
          colorInputFields("catalogueAddress", "black");

          return data;
        } else {
          updateStatusText("error", "Catalogue ID must not be empty.");

          colorInputFields("catalogueID", "red");
          colorInputFields("catalogueName", "black");
          colorInputFields("catalogueAddress", "black");
          clearInput("remove");

          return undefined;
        }
      }
      default: {
        console.log(
          "Entering default switch of clientScripts.js:getUserInput()."
        );
      }
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:getUserInput(): ", exception);
  }
}

// function that updates the DOM
function updateStatusText(type, message) {
  try {
    switch (type) {
      case "success": {
        if (statusText.classList.contains("red")) {
          statusText.remove("red");
        }
        if (!statusText.classList.contains("green")) {
          statusText.className += " green";
        }
        statusText.textContent = message;
        break;
      }
      case "error": {
        if (statusText.classList.contains("green")) {
          statusText.classList.remove("green");
        }
        if (!statusText.classList.contains("red")) {
          statusText.className += " red";
        }
        statusText.textContent = message;
        break;
      }
      default: {
        console.log(
          "Entering default switch of clientScripts.js:updateStatusText()."
        );
      }
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:updateStatusText(): ", exception);
  }
}

// function that handles the catalogue list visibility
function toggleCatalogueListVisibility() {
  try {
    if (catalogueList.style.display === "none") {
      document.getElementById("showCataloguesButton").value = "Hide Catalogues";
      catalogueList.style.display = "block";
    } else {
      document.getElementById("showCataloguesButton").value = "Show Catalogues";
      catalogueList.style.display = "none";
    }
  } catch (exception) {
    console.error(
      "Error in clientScripts.js:toggleCatalogueListVisibility(): ",
      exception
    );
  }
}

function updateCatalogueListDOM(catalogue, fetchResponse) {
  try {
    let catalogueName = document.createElement("SPAN");
    catalogueName.textContent = catalogue.catalogueName;
    catalogueList.appendChild(catalogueName);
    if (catalogue.catalogueType.includes("registry")) {
      let registryIcon = document.createElement("IMG");
      registryIcon.setAttribute("src", "media/registry-icon-small.png");
      registryIcon.setAttribute("alt", "registry-icon");
      registryIcon.style.paddingLeft = "10px";
      catalogueList.appendChild(registryIcon);
    }
    if (catalogue.catalogueType.includes("biobank")) {
      let biobankIcon = document.createElement("IMG");
      biobankIcon.setAttribute("src", "media/biobank-icon-small.png");
      biobankIcon.setAttribute("alt", "biobank-icon");
      biobankIcon.style.paddingLeft = "10px";
      catalogueList.appendChild(biobankIcon);
    }
    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
      let connectedIcon = document.createElement("IMG");
      connectedIcon.setAttribute("src", "media/connected.png");
      connectedIcon.setAttribute("alt", "connected-icon");
      connectedIcon.style.float = "right";
      catalogueList.appendChild(connectedIcon);
    } else {
      let disconnectedIcon = document.createElement("IMG");
      disconnectedIcon.setAttribute("src", "media/disconnected.png");
      disconnectedIcon.setAttribute("alt", "disconnected-icon");
      disconnectedIcon.style.float = "right";
      catalogueList.appendChild(disconnectedIcon);
    }
    catalogueList.appendChild(document.createElement("br"));
    let catalogueAddress = document.createElement("SPAN");
    catalogueAddress.textContent = catalogue.catalogueAddress;
    catalogueList.appendChild(catalogueAddress);
    catalogueList.appendChild(document.createElement("br"));
    let catalogueID = document.createElement("SPAN");
    catalogueID.textContent = catalogue._id;
    catalogueList.appendChild(catalogueID);
    catalogueList.appendChild(document.createElement("br"));
    catalogueList.appendChild(document.createElement("br"));
  } catch (exception) {
    console.error(
      "Error in clientScripts.js:updateCatalogueListDOM(): ",
      exception
    );
  }
}

// function that updates the catalogue list DOM element
async function updateCatalogueList() {
  try {
    catalogueList.textContent = "";
    for (let catalogue of catalogues) {
      fetch(`${pingEndpoint}?address=${catalogue.catalogueAddress}`)
        .then(handleFetchErrors)
        .then((fetchResponse) => {
          updateCatalogueListDOM(catalogue, fetchResponse);
        })
        .catch((exception) =>
          console.error(
            "Error in clientScripts.js:updateCatalogueList():fetch(): ",
            exception
          )
        );
    }
  } catch (exception) {
    console.error(
      "Error in clientScripts.js:updateCatalogueList(): ",
      exception
    );
  }
}

// function that adds a new catalogue to the catalogue directory
async function addCatalogue() {
  try {
    const postMessage = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSONWebToken}`,
        "Content-Type": "application/json",
      },
      body: "",
    };

    if (getUserInput("add") != undefined) {
      // get inserted data
      const newCatalogueData = await getUserInput("add");
      clearInput("add");

      // parse inserted data into POST body
      postMessage.body = JSON.stringify(newCatalogueData);

      // test if the address to be added is responding
      fetch(`${pingEndpoint}?address=${newCatalogueData.catalogueAddress}`)
        .then(handleFetchErrors)
        .then(async (fetchResponse) => {
          // send post request
          if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
            fetch(addCatalogueEndpoint, postMessage)
              .then(handleFetchErrors)
              .then(async (fetchResponse) => {
                if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
                  const fetchResponseData = await fetchResponse.json();
                  updateStatusText(
                    "success",
                    `Catalogue ${newCatalogueData.catalogueName} successfully added using ID ${fetchResponseData.id}.`
                  );
                  getCatalogues();
                } else if (fetchResponse.status == 400) {
                  updateStatusText("error", "Catalogue already exists.");
                } else {
                  updateStatusText("error", "Catalogue could not be added.");
                }
              })
              .catch((exception) =>
                console.error(
                  "Error in clientScripts.js:addCatalogue():fetch(): ",
                  exception
                )
              );
          } else {
            updateStatusText("error", "The entered URL is not accessible.");
          }
        })
        .catch((exception) =>
          console.error(
            "Error in clientScripts.js:addCatalogue():fetch(): ",
            exception
          )
        );
    } else {
      console.error(
        "Error in portal:scripts.js:addCatalogue(): User input is invalid."
      );
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:addCatalogue(): ", exception);
  }
}

// function that removes a new catalogue from the catalogue directory
async function removeCatalogue() {
  try {
    const postMessage = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JSONWebToken}`,
        "Content-Type": "application/json",
      },
      body: "",
    };

    if (getUserInput("remove") != undefined) {
      // get inserted data
      const catalogueID = await getUserInput("remove");
      clearInput("remove");

      // parse inserted data into POST body
      postMessage.body = JSON.stringify(catalogueID);

      // send post request
      fetch(removeCatalogueEndpoint, postMessage)
        .then(handleFetchErrors)
        .then((fetchResponse) => {
          if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
            updateStatusText(
              "success",
              `Successfully removed catalogue using ID ${catalogueID.catalogueID}.`
            );
            getCatalogues();
          } else if (fetchResponse.status == 404) {
            updateStatusText(
              "error",
              `Could not find a catalogue using ID ${catalogueID.catalogueID}.`
            );
          } else if (fetchResponse.status == 401) {
            updateStatusText(
              "error",
              "You are not authorized to remove this catalogue."
            );
          } else {
            updateStatusText("error", "Could not remove this catalogue.");
          }
        })
        .catch((exception) =>
          console.error(
            "Error in clientScripts.js:removeCatalogue():fetch():",
            exception
          )
        );
    } else {
      console.error(
        "Error in clientScripts.js:removeCatalogue(): User input is invalid."
      );
    }
  } catch (exception) {
    console.error("Error in clientScripts.js:removeCatalogue(): ", exception);
  }
}

// function that queries all catalogues from the catalogue directory
async function getCatalogues() {
  try {
    fetch(getCataloguesEndpoint)
      .then(handleFetchErrors)
      .then(async (fetchResponse) => {
        if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
          const data = await fetchResponse.json();
          catalogues = data;
          updateCatalogueList();
        }
      })
      .catch((exception) => {
        console.error(exception);
      });
  } catch (exception) {
    console.error("Error in clientScripts.js:getCatalogues() ", exception);
  }
}
