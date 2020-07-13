'use strict';

// define endpoint addresses
const addCatalogueEndpoint = 'http://localhost:3000/addCatalogues';
const queryCatalogueEndpoint = 'http://localhost:3000/queryCatalogues';

// local variables
const newCatalogueData = {
  catalogueName: '',
  catalogueAddress: ''
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: ''
};

// function that constructs the POST request message
function constructCatalogueData() {
  newCatalogueData.catalogueName = document.getElementById('catalogueName').value;
  newCatalogueData.catalogueAddress = document.getElementById('catalogueAddress').value;
  options.body = JSON.stringify(newCatalogueData);

  document.getElementById('catalogueName').value = '';
  document.getElementById('catalogueAddress').value = '';
}

// function that adds a new catalogue to the catalogue directory
async function addCatalogue() {
  document.getElementById("statusText").innerHTML = "";
  if (document.getElementById('catalogueName').value.length > 0 && document.getElementById('catalogueAddress').value.length > 0) {
    constructCatalogueData();
    const response = await fetch(addCatalogueEndpoint, options);
    if (response.status >= 200 && response.status < 400) {
      const data = await response.json();
      console.log(data);
      document.getElementById("statusText").className += ' green';
      document.getElementById("statusText").innerHTML = "Catalogue added successfully."
      setTimeout(function () {
        document.getElementById("statusText").innerHTML = '';
      }, 4000);
    } else {
      document.getElementById("statusText").className += ' red';
      document.getElementById("statusText").innerHTML = "Catalogue could not be added.";
      setTimeout(function () {
        document.getElementById("statusText").innerHTML = '';
      }, 4000);
      throw console.error('Response out of range.');
    }
  } else {
    document.getElementById("statusText").className += ' red';
    document.getElementById("statusText").innerHTML = "Catalogue name and address might not be empty."
    setTimeout(function () {
      document.getElementById("statusText").innerHTML = '';
    }, 4000);
    document.getElementById('catalogueName').value = "";
    document.getElementById('catalogueAddress').value = "";
  }
}

// function that queries all catalogues from the catalogue directory
async function queryCatalogues() {
  document.getElementById("catalogueList").innerHTML = "";
  const response = await fetch(queryCatalogueEndpoint);
  if (response.status >= 200 && response.status < 400) {
    const data = await response.json();
    console.log(data);
    data.forEach(element => {
      document.getElementById("catalogueList").appendChild(document.createTextNode(element.catalogueName));
      document.getElementById("catalogueList").appendChild(document.createElement("br"));
      document.getElementById("catalogueList").appendChild(document.createTextNode(element.catalogueAddress));
      document.getElementById("catalogueList").appendChild(document.createElement("br"));
      document.getElementById("catalogueList").appendChild(document.createElement("br"));
    });
  } else {
    throw console.error('Response out of range.');
  }
}

// function that handles the search input
async function handleSearch() {
  const input = document.getElementById("searchBar").value;
  console.log(input);
}