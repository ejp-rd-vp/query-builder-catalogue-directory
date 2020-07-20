"use strict";

// define endpoint addresses
const addCatalogueEndpoint = "http://localhost:3001/addCatalogue";
const removeCatalogueEndpoint = "http://localhost:3001/removeCatalogue";
const getCataloguesEndpoint = "http://localhost:3001/getCatalogues";
const searchEndpoint = "http://localhost:3001/search";
const pingEndpoint = "http://localhost:3001/pingCatalogue";

var countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua &amp; Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia &amp; Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central Arfrican Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauro",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre &amp; Miquelon",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St Kitts &amp; Nevis",
  "St Lucia",
  "St Vincent",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad &amp; Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks &amp; Caicos",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const JSONWebToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkQxclRNYWVqMVR6SXZFczVBWDg0UCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sdW9vZ3FtMy5ldS5hdXRoMC5jb20vIiwic3ViIjoiaVlwakU1N2J6T3F0eVVqRGpUQkVBRmZ4VWV4SzhQR2pAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9leHByZXNzLmFwaSIsImlhdCI6MTU5NTIzMTk4MCwiZXhwIjoxNTk1MzE4MzgwLCJhenAiOiJpWXBqRTU3YnpPcXR5VWpEalRCRUFGZnhVZXhLOFBHaiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.IxcdxVbh-IjTmiH2Ev6zt0jNEXDj5jZMf7IYZdWs2OrkPpaslVmt_FrAkP6kfW40EP_Yp_JrNma4gCzgYNLPsfk_AaEOe-63xn_zpj3hyWxDEargE0EDYImwtYYzbYvUgJE1ofCGNVXzVgF4C3haw2RnvV2MvIePCxex7UdZnF46S2RsMl1vLPl18Cin58LcsVWFAT1WnsrHLn0sdvQWOFfkFe95u3Y-GWJAaMS0MwtxdA6gKDLPkVC4VG-DMWaDs7N1cLvkG6EJzla7GkmYYxWVWH-tRT_JrwDzcWI5gjuvkKmu1y1NeazkuzNnCid7hRK_rEQF-Oepo6jKJGLQCQ";

let catalogueListVisibility = Boolean(false);

// function that clears the users' input
function clearInput(useCase) {
  if (useCase === "add") {
    document.getElementById("catalogueName").value = "";
    document.getElementById("catalogueAddress").value = "";
  } else if (useCase === "remove") {
    document.getElementById("catalogueID").value = "";
  }
}

// function that gets the users' input
function getUserInput(useCase) {
  try {
    if (useCase === "add") {
      var data = {
        catalogueName: "",
        catalogueAddress: "",
      };

      if (
        document.getElementById("catalogueName").value.length > 0 &&
        document.getElementById("catalogueAddress").value.length > 0
      ) {
        // get user input
        data.catalogueName = document.getElementById("catalogueName").value;
        data.catalogueAddress = document.getElementById(
          "catalogueAddress"
        ).value;

        document.getElementById("statusText").textContent = " ";

        return data;
      } else {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "Catalogue name and address might not be empty.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);

        clearInput("add");

        return undefined;
      }
    } else if (useCase === "remove") {
      var data = {
        catalogueID: "",
      };

      if (document.getElementById("catalogueID").value.length > 0) {
        // get user input
        data.catalogueID = document.getElementById("catalogueID").value;

        document.getElementById("statusText").textContent = " ";

        return data;
      } else {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "Catalogue ID might not be empty.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);

        clearInput("remove");
      }
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:getUserInput(): ", error);
  }
}

// function that updates the DOM
async function updateStatusText(useCase, response) {
  try {
    if (useCase === "add") {
      const responseData = await response.json();
      if (response.status >= 200 && response.status < 400) {
        if (document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").remove("red");
        }
        if (
          !document.getElementById("statusText").classList.contains("green")
        ) {
          document.getElementById("statusText").className += " green";
        }
        document.getElementById(
          "statusText"
        ).textContent = `Successfully added catalogue with ID ${responseData.id}.`;
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);
      } else if (response.status == 401) {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "You are not authorized to add a catalogue.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);
      } else {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "Catalogue could not be added.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);
        console.error(
          "Error in portal:scripts.js:addCatalogue(): POST response out of range."
        );
      }
    } else if (useCase === "remove") {
      const responseData = await response.json();
      if (response.status >= 200 && response.status < 400) {
        if (document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").remove("red");
        }
        if (
          !document.getElementById("statusText").classList.contains("green")
        ) {
          document.getElementById("statusText").className += " green";
        }
        document.getElementById(
          "statusText"
        ).textContent = `Successfully removed catalogue with id ${responseData.id}.`;
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 4000);
      } else if (response.status == 401) {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "You are not authorized to remove this catalogue.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 4000);
      } else {
        if (document.getElementById("statusText").classList.contains("green")) {
          document.getElementById("statusText").classList.remove("green");
        }
        if (!document.getElementById("statusText").classList.contains("red")) {
          document.getElementById("statusText").className += " red";
        }
        document.getElementById("statusText").textContent =
          "Catalogue could not be removed.";
        setTimeout(function () {
          document.getElementById("statusText").textContent = " ";
        }, 6000);
        console.error(
          "Error in portal:scripts.js:removeCatalogue(): POST response out of range."
        );
      }
    } else if (useCase === "search") {
      if (document.getElementById("statusText").classList.contains("green")) {
        document.getElementById("statusText").classList.remove("green");
      }
      if (!document.getElementById("statusText").classList.contains("red")) {
        document.getElementById("statusText").className += " red";
      }
      document.getElementById("statusText").textContent =
        "The search did not match any database entries.";
      setTimeout(function () {
        document.getElementById("statusText").textContent = " ";
      }, 6000);
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:updateStatusText(): ", error);
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
      newCatalogueData.auth = JSONWebToken;
      // clear input fields
      clearInput("add");
      // parse inserted data into POST body
      postMessage.body = JSON.stringify(newCatalogueData);

      // send post request
      const response = await fetch(addCatalogueEndpoint, postMessage);

      // updated DOM depending on response
      updateStatusText("add", response);
      getCatalogues(false);
    } else {
      console.error(
        "Error in portal:scripts.js:addCatalogue(): User input is invalid."
      );
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:addCatalogue(): ", error);
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
      const response = await fetch(removeCatalogueEndpoint, postMessage);

      // updated DOM depending on response
      updateStatusText("remove", response);
      getCatalogues(false);
    } else {
      console.error(
        "Error in portal:scripts.js:removeCatalogue(): User input is invalid."
      );
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:removeCatalogue(): ", error);
  }
}

// function that queries all catalogues from the catalogue directory
async function getCatalogues(toggle) {
  try {
    if (toggle) {
      if (catalogueListVisibility == false) {
        document.getElementById("catalogueList").textContent = "";
        const response = await fetch(getCataloguesEndpoint);
        if (response.status >= 200 && response.status < 400) {
          const data = await response.json();
          //console.log(data);
          data.forEach((element) => {
            document
              .getElementById("catalogueList")
              .appendChild(document.createTextNode(element.catalogueName));
            document
              .getElementById("catalogueList")
              .appendChild(document.createElement("br"));
            document
              .getElementById("catalogueList")
              .appendChild(document.createTextNode(element.catalogueAddress));
            document
              .getElementById("catalogueList")
              .appendChild(document.createElement("br"));
            document
              .getElementById("catalogueList")
              .appendChild(document.createTextNode(element._id));
            document
              .getElementById("catalogueList")
              .appendChild(document.createElement("br"));
            document
              .getElementById("catalogueList")
              .appendChild(document.createElement("br"));
          });
          document.getElementById("showCataloguesButton").value =
            "Hide Catalogues";
          catalogueListVisibility = true;
        } else {
          throw console.error("Response out of range.");
        }
      } else if (catalogueListVisibility == true) {
        document.getElementById("showCataloguesButton").value =
          "Show Catalogues";
        catalogueListVisibility = false;
        document.getElementById("catalogueList").textContent = "";
      }
    } else if (!toggle) {
      document.getElementById("catalogueList").textContent = "";
      const response = await fetch(getCataloguesEndpoint);
      if (response.status >= 200 && response.status < 400) {
        const data = await response.json();
        //console.log(data);
        data.forEach((element) => {
          document
            .getElementById("catalogueList")
            .appendChild(document.createTextNode(element.catalogueName));
          document
            .getElementById("catalogueList")
            .appendChild(document.createElement("br"));
          document
            .getElementById("catalogueList")
            .appendChild(document.createTextNode(element.catalogueAddress));
          document
            .getElementById("catalogueList")
            .appendChild(document.createElement("br"));
          document
            .getElementById("catalogueList")
            .appendChild(document.createTextNode(element._id));
          document
            .getElementById("catalogueList")
            .appendChild(document.createElement("br"));
          document
            .getElementById("catalogueList")
            .appendChild(document.createElement("br"));
        });
      } else {
        throw console.error("Response out of range.");
      }
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:getCatalogues(): ", error);
  }
}

// function that handles the search input
async function handleSearch() {
  try {
    const results = document.getElementById("results");
    results.textContent = "";
    const input = document.getElementById("searchBar");
    if (input.value.length < 1) {
      results.textContent = "";
      return;
    } else {
      const query = `${searchEndpoint}?input=${input.value}`;
      document.getElementById("searchBar").style.backgroundImage =
        "url('./media/loading-animation.gif')";
      const response = await fetch(query);
      var numResults = 0;
      if (response.status >= 200 && response.status < 400) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.length > 0) {
          responseData.forEach((catalogueElement) => {
            if (catalogueElement.content.length > 0) {
              numResults++;
              var catalogueLiNode = document.createElement("LI");
              var catalogueName = document.createTextNode(
                catalogueElement.name
              );
              catalogueLiNode.appendChild(catalogueName);
              results.appendChild(catalogueLiNode);
              var contentLiNode = document.createElement("LI");
              catalogueElement.content.forEach((contentElement) => {
                contentLiNode
                  .appendChild(document.createElement("LI"))
                  .appendChild(document.createTextNode(contentElement[0].name));
              });
              results.appendChild(contentLiNode);
            }
          });
          if (numResults == 0) {
            document.getElementById("searchBar").style.backgroundImage = "none";
            results.textContent = "";
            input.value = "";
            updateStatusText("search");
            return;
          }
        } else {
          document.getElementById("searchBar").style.backgroundImage = "none";
          results.textContent = "";
          input.value = "";
          updateStatusText("search");
          return;
        }
        document.getElementById("searchBar").style.backgroundImage = "none";
      }
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:handleSearch(): ", error);
  }
}

async function pingCatalogue(catalogueAddress) {
  try {
    const query = `${pingEndpoint}?address=${catalogueAddress}`;
    const response = await fetch(query);
  } catch (error) {
    console.error("Error in portal:scripts.js:pingCatalogue(): ", error);
  }
}
