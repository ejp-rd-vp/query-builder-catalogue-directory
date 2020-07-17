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
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkQxclRNYWVqMVR6SXZFczVBWDg0UCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sdW9vZ3FtMy5ldS5hdXRoMC5jb20vIiwic3ViIjoiaVlwakU1N2J6T3F0eVVqRGpUQkVBRmZ4VWV4SzhQR2pAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9leHByZXNzLmFwaSIsImlhdCI6MTU5NDk4NzQ1MywiZXhwIjoxNTk1MDczODUzLCJhenAiOiJpWXBqRTU3YnpPcXR5VWpEalRCRUFGZnhVZXhLOFBHaiIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.VJf54Ttac0XmMxLs2cLGSfprRmD5stXX32MrViGx6Is_1EuQ8vPd7hVn4B6JlI94llCIHpLjTOLstuoWGUeqD2EiWSB2RT6qkCJMsktz0mZD1ItJ1_MhzMOOjfNy8klyNoZmvlPZqGPCcApeaCl9qGBxCoyoa6lNj0aJ8uMIVtL9-PKMCRU2CR2QnIuIE_qkwwGyeOItnkCiucfabcVBMHmtrvCdNM8Fek-Dz8Hurz5iGqJW-O-a6rhaUd_ddmfPQwbdSTRawzHU99krSaziQPjMPVXNqZVwCOqhvIG7snjq-AU1bw7ybEW6gL57BogbFWYFjZZ9YeWvfFtD6dlNjA";

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

        document.getElementById("statusText").innerHTML = "";

        return data;
      } else {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "Catalogue name and address might not be empty.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);

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

        document.getElementById("statusText").innerHTML = "";

        return data;
      } else {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "Catalogue ID might not be empty.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);

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
        document.getElementById("statusText").className += " green";
        document.getElementById(
          "statusText"
        ).innerHTML = `Successfully added catalogue with ID ${responseData.id}.`;
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
      } else if (response.status == 401) {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "You are not authorized to add a catalogue.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
      } else {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "Catalogue could not be added.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
        console.error(
          "Error in portal:scripts.js:addCatalogue(): POST response out of range."
        );
      }
    } else if (useCase === "remove") {
      const responseData = await response.json();
      if (response.status >= 200 && response.status < 400) {
        document.getElementById("statusText").className += " green";
        document.getElementById(
          "statusText"
        ).innerHTML = `Successfully removed catalogue with id ${responseData.id}.`;
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
      } else if (response.status == 401) {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "You are not authorized to remove this catalogue.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
      } else {
        document.getElementById("statusText").className += " red";
        document.getElementById("statusText").innerHTML =
          "Catalogue could not be removed.";
        setTimeout(function () {
          document.getElementById("statusText").innerHTML = "";
        }, 4000);
        console.error(
          "Error in portal:scripts.js:removeCatalogue(): POST response out of range."
        );
      }
    } else if (useCase === "search") {
      document.getElementById("statusText").className += " red";
      document.getElementById("statusText").innerHTML =
        "The search did not match any database entries.";
      setTimeout(function () {
        document.getElementById("statusText").innerHTML = "";
      }, 4000);
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
async function getCatalogues() {
  try {
    if (catalogueListVisibility == false) {
      document.getElementById("catalogueList").innerHTML = "";
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
      document.getElementById("showCataloguesButton").value = "Show Catalogues";
      catalogueListVisibility = false;
      document.getElementById("catalogueList").textContent = "";
    }
  } catch (error) {
    console.error("Error in portal:scripts.js:getCatalogues(): ", error);
  }
}

// function that handles the search input
async function handleSearch() {
  try {
    const results = document.getElementById("results");
    results.innerHTML = "";
    const input = document.getElementById("searchBar");
    if (input.value.length < 1) {
      results.innerHTML = "";
      return;
    } else {
      const query = `${searchEndpoint}?input=${input.value}`;
      const response = await fetch(query);
      //console.log(query);
      if (response.status >= 200 && response.status < 400) {
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.length > 0) {
          responseData.forEach((catalogueElement) => {
            var catalogueLiNode = document.createElement("LI");
            var catalogueName = document.createTextNode(catalogueElement.name);
            catalogueLiNode.appendChild(catalogueName);
            results.appendChild(catalogueLiNode);
            var contentLiNode = document.createElement("LI");
            catalogueElement.content.forEach((contentElement) => {
              contentLiNode
                .appendChild(document.createElement("LI"))
                .appendChild(document.createTextNode(contentElement[0].name));
            });
            results.appendChild(contentLiNode);
          });
        } else {
          results.innerHTML = "";
          input.value = "";
          updateStatusText("search");
          return;
        }
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

// function that handles the auto-complete
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

//autocomplete(document.getElementById("searchBar"), countries);
