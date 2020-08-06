"use strict";

// define API endpoint addresses
const catalogueDirectoryAddress: string = window.location.origin;
const getCataloguesEndpoint: string =
  catalogueDirectoryAddress + "/getCatalogues";
const addCatalogueEndpoint: string =
  catalogueDirectoryAddress + "/addCatalogue";
const removeCatalogueEndpoint: string =
  catalogueDirectoryAddress + "/removeCatalogue";
const pingEndpoint: string = catalogueDirectoryAddress + "/pingCatalogue";

// global variables
let catalogues: Array<any>;

// html components
const statusText = document.getElementById("statusText")! as HTMLSpanElement;
const catalogueNameInput = document.getElementById(
  "catalogueName"
)! as HTMLInputElement;
const catalogueAddressInput = document.getElementById(
  "catalogueAddress"
)! as HTMLInputElement;
const registryCheckboxInput = document.getElementById(
  "registryCheckbox"
)! as HTMLInputElement;
const catalogueDescriptionInput = document.getElementById(
  "catalogueDescription"
)! as HTMLInputElement;
const biobankCheckboxInput = document.getElementById(
  "biobankCheckbox"
)! as HTMLInputElement;
const catalogueIDInput = document.getElementById(
  "catalogueID"
)! as HTMLInputElement;
const catalogueList = document.getElementById(
  "catalogueList"
)! as HTMLDivElement;

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
function isValidUrl(url: string) {
  try {
    new URL(url);
  } catch (exception) {
    console.error("Error in clientScripts.js:isValidUrl(): ", exception);
    return false;
  }
  return true;
}

// function that indicates input elements that are responsible for errors
function colorInputFields(inputField: string, color: string) {
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
function clearInput(useCase: string) {
  try {
    switch (useCase) {
      case "add": {
        catalogueNameInput.value = "";
        catalogueAddressInput.value = "";
        catalogueDescriptionInput.value = "";
        registryCheckboxInput.checked = false;
        biobankCheckboxInput.checked = false;
        break;
      }
      case "remove": {
        catalogueIDInput.value = "";
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
function getUserInput(useCase: string) {
  try {
    switch (useCase) {
      case "add": {
        let data: any = {
          catalogueName: "",
          catalogueAddress: "",
          catalogueDescription: "",
          catalogueType: [],
        };

        if (
          catalogueNameInput.value.length > 0 &&
          catalogueAddressInput.value.length > 0 &&
          (registryCheckboxInput.checked || biobankCheckboxInput.checked) &&
          catalogueDescriptionInput.value.length > 0
        ) {
          if (isValidUrl(catalogueAddressInput.value)) {
            // get user input
            data.catalogueName = catalogueNameInput.value;
            data.catalogueAddress = catalogueAddressInput.value;
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
            colorInputFields("catalogueID", "black");

            return data;
          } else {
            updateStatusText("error", "Catalogue address must be a valid URL.");

            colorInputFields("catalogueDescription", "black");
            colorInputFields("catalogueName", "black");
            colorInputFields("catalogueAddress", "red");
            colorInputFields("catalogueID", "black");
            clearInput("add");

            return undefined;
          }
        } else {
          updateStatusText(
            "error",
            "Catalogue name, address, type and description must not be empty."
          );

          colorInputFields("catalogueDescription", "red");
          colorInputFields("catalogueName", "red");
          colorInputFields("catalogueAddress", "red");
          colorInputFields("catalogueID", "black");
          clearInput("add");

          return undefined;
        }
      }
      case "remove": {
        let data: any = { catalogueID: "" };

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
function updateStatusText(type: string, message: string) {
  try {
    switch (type) {
      case "success": {
        if (statusText.classList.contains("red")) {
          statusText.classList.remove("red");
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
      document.getElementById("showCataloguesButton").textContent =
        "Hide Catalogues";
      catalogueList.style.display = "block";
    } else {
      document.getElementById("showCataloguesButton").textContent =
        "Show Catalogues";
      catalogueList.style.display = "none";
    }
  } catch (exception) {
    console.error(
      "Error in clientScripts.js:toggleCatalogueListVisibility(): ",
      exception
    );
  }
}

function updateCatalogueListDOM(catalogue: any, fetchResponse) {
  try {
    let catalogueName = document.createElement("SPAN")! as HTMLSpanElement;
    catalogueName.style.fontSize = "18px";
    catalogueName.textContent = catalogue.catalogueName;
    catalogueList.appendChild(catalogueName);
    if (catalogue.catalogueType.includes("registry")) {
      let registryIcon = document.createElement("IMG")! as HTMLImageElement;
      registryIcon.setAttribute("src", "media/registry-icon.png");
      registryIcon.setAttribute("alt", "registry-icon");
      registryIcon.style.paddingLeft = "10px";
      catalogueList.appendChild(registryIcon);
    }
    if (catalogue.catalogueType.includes("biobank")) {
      let biobankIcon = document.createElement("IMG")! as HTMLImageElement;
      biobankIcon.setAttribute("src", "media/biobank-icon.png");
      biobankIcon.setAttribute("alt", "biobank-icon");
      biobankIcon.style.paddingLeft = "10px";
      catalogueList.appendChild(biobankIcon);
    }
    if (fetchResponse.status >= 200 && fetchResponse.status < 400) {
      let connectedIcon = document.createElement("IMG")! as HTMLImageElement;
      connectedIcon.setAttribute("src", "media/connected.png");
      connectedIcon.setAttribute("alt", "connected-icon");
      connectedIcon.style.float = "right";
      catalogueList.appendChild(connectedIcon);
    } else {
      let disconnectedIcon = document.createElement("IMG")! as HTMLImageElement;
      disconnectedIcon.setAttribute("src", "media/disconnected.png");
      disconnectedIcon.setAttribute("alt", "disconnected-icon");
      disconnectedIcon.style.float = "right";
      catalogueList.appendChild(disconnectedIcon);
    }
    catalogueList.appendChild(document.createElement("br")! as HTMLBRElement);
    let catalogueDescription = document.createElement(
      "SPAN"
    )! as HTMLSpanElement;
    catalogueDescription.style.fontSize = "15px";
    catalogueDescription.textContent = catalogue.catalogueDescription;
    catalogueList.appendChild(catalogueDescription);
    catalogueList.appendChild(document.createElement("br")! as HTMLBRElement);
    let catalogueAddress = document.createElement("SPAN")! as HTMLSpanElement;
    catalogueAddress.style.fontSize = "15px";
    catalogueAddress.textContent = catalogue.catalogueAddress;
    catalogueList.appendChild(catalogueAddress);
    catalogueList.appendChild(document.createElement("br")! as HTMLBRElement);
    let catalogueID = document.createElement("SPAN")! as HTMLSpanElement;
    catalogueID.style.fontSize = "15px";
    catalogueID.textContent = catalogue._id;
    catalogueList.appendChild(catalogueID);
    catalogueList.appendChild(document.createElement("br")! as HTMLBRElement);
    catalogueList.appendChild(document.createElement("br")! as HTMLBRElement);
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
