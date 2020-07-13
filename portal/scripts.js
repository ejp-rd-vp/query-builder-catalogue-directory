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
  document.getElementById("successIndicator").innerHTML = "";
  if (document.getElementById('catalogueName').value.length > 0 && document.getElementById('catalogueAddress').value.length > 0) {
    constructCatalogueData();
    const response = await fetch(addCatalogueEndpoint, options);
    if (response.status >= 200 && response.status < 400) {
      const data = await response.json();
      console.log(data);
      document.getElementById("successIndicator").innerHTML = "Catalogue added successfully."
    } else {
      document.getElementById("successIndicator").innerHTML = "Catalogue could not be added.";
      throw console.error('Response out of range.');
    }
  } else {
    document.getElementById("successIndicator").innerHTML = "Catalogue name and address might not be empty."
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