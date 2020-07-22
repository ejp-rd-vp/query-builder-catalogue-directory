"use strict";

// define endpoint addresses
const addCatalogueEndpoint = "http://localhost:3001/addCatalogue";
const removeCatalogueEndpoint = "http://localhost:3001/removeCatalogue";
const getCataloguesEndpoint = "http://localhost:3001/getCatalogues";
const searchEndpoint = "http://localhost:3001/search";
const pingEndpoint = "http://localhost:3001/pingCatalogue";

const JSONWebToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkQxclRNYWVqMVR6SXZFczVBWDg0UCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sdW9vZ3FtMy5ldS5hdXRoMC5jb20vIiwic3ViIjoiaVlwakU1N2J6T3F0eVVqRGpUQkVBRmZ4VWV4SzhQR2pAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9leHByZXNzLmFwaSIsImlhdCI6MTU5NTQwNzYxMCwiZXhwIjoxNTk1NDk0MDEwLCJhenAiOiJpWXBqRTU3YnpPcXR5VWpEalRCRUFGZnhVZXhLOFBHaiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.sGCivXaeSlWf8E8bxAXqGSnSzvfIBYxEBAqJk7kPZyPAHPhndXVIqsoByNSP1YVFRINNESeU1AnCONJVS_FKN7k8kmSeCdwcS3CE9xXlOMF6830k1hBHxlMqeMbcPWdRbwK0TiqcK0DMR-i-f9h9_xWk_dpE4F85KBKA4NeUJX2qecI18LIhHaGAJR_UILR9eBZUAyLXDXr5unPQqvp02mF_bLCD6OFDnZkZ2bLSuAF3XQSlhnIllvNc9jFrqm5ZvPaMqFCa3TfX6kYD3tuO8ASMc7TLoveYaULbyHo24ZGZaBqjzCFl91rwefAnyKaZu-iyDJYx5u4WOp5A2O04gw";

let catalogueListVisibility = Boolean(true);
const catalogues = [{}];
const statusText = document.getElementById("statusText");
const catalogueNameInput = document.getElementById("catalogueName");
const catalogueAddressInput = document.getElementById("catalogueAddress");
const catalogueIDInput = document.getElementById("catalogueID");
const searchInput = document.getElementById("searchBar");
const resultList = document.getElementById("resultList");
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
    console.error("Error in scripts.js:handleFetchErrors(): ", exception);
  }
}

// function that checks for a valid url string
function isValidUrl(url) {
  try {
    new URL(url);
  } catch (exception) {
    console.log("Error in scripts.js:isValidUrl(): ", exception);
    return false;
  }

  return true;
}

// function that indicates input elements that are responsible for errors
function colorInputFields(inputField, color) {
  try {
    const input = document.getElementById(inputField);

    switch (color) {
      case "red":
        input.style.borderColor = "firebrick";
        return;
      case "black":
        input.style.borderColor = "black";
        return;
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:colorInputFields(): ", exception);
  }
}

// function that clears the users' input
function clearInput(useCase) {
  try {
    switch (useCase) {
      case "add":
        catalogueNameInput.value = "";
        catalogueAddressInput.value = "";
      case "remove":
        catalogueIDInput.value = "";
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:clearInput(): ", exception);
  }
}

// function that gets the users' input
function getUserInput(useCase) {
  try {
    switch (useCase) {
      case "add":
        var data = {
          catalogueName: "",
          catalogueAddress: "",
        };

        if (
          catalogueNameInput.value.length > 0 &&
          catalogueAddressInput.value.length > 0
        ) {
          if (isValidUrl(catalogueAddressInput.value)) {
            // get user input
            data.catalogueName = catalogueNameInput.value;
            data.catalogueAddress = catalogueAddressInput.value;

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
            "Catalogue name and address might not be empty."
          );
          colorInputFields("catalogueName", "red");
          colorInputFields("catalogueAddress", "red");
          colorInputFields("catalogueID", "black");
          clearInput("add");

          return undefined;
        }

      case "remove":
        var data = {
          catalogueID: "",
        };

        if (catalogueIDInput.value.length > 0) {
          data.catalogueID = catalogueIDInput.value;

          colorInputFields("catalogueID", "black");
          colorInputFields("catalogueName", "black");
          colorInputFields("catalogueAddress", "black");

          return data;
        } else {
          updateStatusText("error", "Catalogue ID might not be empty.");

          colorInputFields("catalogueID", "red");
          colorInputFields("catalogueName", "black");
          colorInputFields("catalogueAddress", "black");
          clearInput("remove");

          return undefined;
        }
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:getUserInput(): ", exception);
  }
}

// function that updates the DOM
function updateStatusText(type, message) {
  try {
    switch (type) {
      case "success":
        if (statusText.classList.contains("red")) {
          statusText.remove("red");
        }
        if (!statusText.classList.contains("green")) {
          statusText.className += " green";
        }
        statusText.textContent = message;
        return;
      case "error":
        if (statusText.classList.contains("green")) {
          statusText.classList.remove("green");
        }
        if (!statusText.classList.contains("red")) {
          statusText.className += " red";
        }
        statusText.textContent = message;
        return;
      default:
        console.log("Entering default switch of updatedStatusText().");
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:updateStatusText(): ", exception);
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
                const fetchResponseData = await fetchResponse.json();
                updateStatusText(
                  "success",
                  `Catalogue ${newCatalogueData.catalogueName} successfully added using ID ${fetchResponseData.id}.`
                );
                getCatalogues(false);
              })
              .catch((exception) => console.error(exception));
          } else {
            updateStatusText("error", "The entered URL is not accessible.");
          }
        })
        .catch((exception) => console.error(exception));
    } else {
      console.error(
        "Error in portal:scripts.js:addCatalogue(): User input is invalid."
      );
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:addCatalogue(): ", exception);
  }
}

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
            getCatalogues(false);
          } else {
            updateStatusText(
              "error",
              `Could not find a catalogue using ID ${catalogueID.catalogueID}.`
            );
          }
        })
        .catch((exception) => console.error(exception));
    } else {
      console.error(
        "Error in portal:scripts.js:removeCatalogue(): User input is invalid."
      );
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:removeCatalogue(): ", exception);
  }
}

// function that queries all catalogues from the catalogue directory
async function getCatalogues(toggle) {
  try {
    if (toggle) {
      if (catalogueListVisibility == false) {
        catalogueList.textContent = "";
        document.getElementById("showCataloguesButton").value =
          "Hide Catalogues";
        catalogueListVisibility = true;
        const response = await fetch(getCataloguesEndpoint);
        if (response.status >= 200 && response.status < 400) {
          const data = await response.json();
          //console.log(catalogues);
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            catalogueList.appendChild(
              document.createTextNode(element.catalogueName)
            );
            const pingResponse = await fetch(
              `${pingEndpoint}?address=${element.catalogueAddress}`
            );
            const responseData = await pingResponse.json();
            if (responseData >= 200 && responseData < 400) {
              var checkIcon = document.createElement("IMG");
              checkIcon.setAttribute("src", "media/check-icon.png");
              checkIcon.setAttribute("alt", "check-icon");
              checkIcon.style.float = "right";
              catalogueList.appendChild(checkIcon);
            } else {
              var xIcon = document.createElement("IMG");
              xIcon.setAttribute("src", "media/x-icon.png");
              xIcon.setAttribute("alt", "x-icon");
              xIcon.style.float = "right";
              xIcon.style.marginRight = "8px";
              catalogueList.appendChild(xIcon);
            }
            catalogueList.appendChild(document.createElement("br"));
            catalogueList.appendChild(
              document.createTextNode(element.catalogueAddress)
            );
            catalogueList.appendChild(document.createElement("br"));
            catalogueList.appendChild(document.createTextNode(element._id));
            catalogueList.appendChild(document.createElement("br"));
            catalogueList.appendChild(document.createElement("br"));
          }
        } else {
          throw console.error("Response out of range.");
        }
      } else if (catalogueListVisibility == true) {
        document.getElementById("showCataloguesButton").value =
          "Show Catalogues";
        catalogueListVisibility = false;
        catalogueList.textContent = "";
      }
    } else if (!toggle) {
      catalogueList.textContent = "";
      const response = await fetch(getCataloguesEndpoint);
      if (response.status >= 200 && response.status < 400) {
        const data = await response.json();
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          catalogueList.appendChild(
            document.createTextNode(element.catalogueName)
          );
          const pingResponse = await fetch(
            `${pingEndpoint}?address=${element.catalogueAddress}`
          );
          const responseData = await pingResponse.json();
          if (responseData >= 200 && responseData < 400) {
            var checkIcon = document.createElement("IMG");
            checkIcon.setAttribute("src", "media/check-icon.png");
            checkIcon.setAttribute("alt", "check-icon");
            checkIcon.style.float = "right";
            catalogueList.appendChild(checkIcon);
          } else {
            var xIcon = document.createElement("IMG");
            xIcon.setAttribute("src", "media/x-icon.png");
            xIcon.setAttribute("alt", "x-icon");
            xIcon.style.float = "right";
            xIcon.style.marginRight = "8px";
            catalogueList.appendChild(xIcon);
          }
          catalogueList.appendChild(document.createElement("br"));
          catalogueList.appendChild(
            document.createTextNode(element.catalogueAddress)
          );
          catalogueList.appendChild(document.createElement("br"));
          catalogueList.appendChild(document.createTextNode(element._id));
          catalogueList.appendChild(document.createElement("br"));
          catalogueList.appendChild(document.createElement("br"));
        }
      } else {
        throw console.error("Response out of range.");
      }
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:getCatalogues(): ", exception);
  }
}

// function that handles the search input
async function handleSearch() {
  try {
    resultList.textContent = "";

    if (searchInput.value.length < 1) {
      resultList.textContent = "";
      return;
    } else {
      const query = `${searchEndpoint}?input=${searchInput.value}`;
      searchInput.style.backgroundImage =
        "url('./media/loading-animation.gif')";
      const response = await fetch(query);
      var numResults = 0;
      if (response.status >= 200 && response.status < 400) {
        const responseData = await response.json();
        if (responseData.length > 0) {
          responseData.forEach((catalogueElement) => {
            if (catalogueElement.content.length > 0) {
              numResults++;
              var catalogueLiNode = document.createElement("LI");
              var catalogueName = document.createTextNode(
                catalogueElement.name
              );
              catalogueLiNode.appendChild(catalogueName);
              resultList.appendChild(catalogueLiNode);
              var contentLiNode = document.createElement("LI");
              catalogueElement.content.forEach((contentElement) => {
                contentLiNode
                  .appendChild(document.createElement("LI"))
                  .appendChild(document.createTextNode(contentElement[0].name));
              });
              resultList.appendChild(contentLiNode);
            }
          });
          if (numResults == 0) {
            searchInput.style.backgroundImage = "none";
            resultList.textContent = "";
            searchInput.value = "";
            updateStatusText(
              "error",
              "The entered search did not match any results."
            );
            return;
          }
        } else {
          searchInput.style.backgroundImage = "none";
          resultList.textContent = "";
          searchInput.value = "";
          updateStatusText(
            "error",
            "The entered search did not match any results."
          );
          return;
        }
        searchInput.style.backgroundImage = "none";
      }
    }
  } catch (exception) {
    console.error("Error in portal:scripts.js:handleSearch(): ", exception);
  }
}
