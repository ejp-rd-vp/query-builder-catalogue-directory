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

function constructData() {
  addCatalogueData.catalogueName = document.getElementById('catalogueName').value;
  addCatalogueData.catalogueAddress = document.getElementById('catalogueAddress').value;
  options.body = JSON.stringify(addCatalogueData);
  document.getElementById('catalogueName').value = '';
  document.getElementById('catalogueAddress').value = '';
}

async function addCatalogue() {
  constructData();
  const response = await fetch(addCatalogueEndpoint, options);
  if (response.status >= 200 && response.status < 400) {
    const data = await response.json();
    console.log(data);
    document.getElementById("successIndicator").innerHTML = "Catalogue added successfully."
  } else {
    throw console.error('Response out of range.');
  }
}