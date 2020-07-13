const addCatalogueEndpoint = 'http://localhost:3000/addCatalogues';
const queryCatalogueEndpoint = 'http://localhost:3000/queryCatalogues';

const addCatalogueData = {
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

function constructCatalogueData() {
  addCatalogueData.catalogueName = document.getElementById('catalogueName').value;
  addCatalogueData.catalogueAddress = document.getElementById('catalogueAddress').value;
  options.body = JSON.stringify(addCatalogueData);
  document.getElementById('catalogueName').value = '';
  document.getElementById('catalogueAddress').value = '';
}

async function addCatalogue() {
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
}

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

async function handleSearch() {
  const input = document.getElementById("searchBar").value;
  console.log(input);
}