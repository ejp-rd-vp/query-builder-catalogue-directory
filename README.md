# EJP-RD - Central catalogue directory

A draft of the EJP-RD - 'Central catalogue directory' component. It implements a REST API that can be used to fetch, add and remove catalogue addresses via HTTP requests.

## Requirements

- [Node.js](https://nodejs.org/ "https://nodejs.org/")
- [Git](https://git-scm.com/ "https://git-scm.com/")

## Deployment

- `$ git clone https://github.com/ejp-rd-vp/query-builder-catalogue-directory.git` to clone this repository.
- `$ cd query-builder-catalogue-directory/directory` to navigate to the directory root path.
- `$ npm i` to install missing dependencies.
- Create a file named `.env` in the `directory` folder for environenment variable specification.
- Set the database file path inside the `.env` file as follows: `DATABASE_PATH=<PATH_TO_YOUR_DATABASE_FILE>`, e.g.: `DATABASE_PATH=database.json`. Note that this file needs to exist in order for the server to operate correctly.
- `$ node src/catalogueDirectory.js <YOUR_PORT>` to start the web service.

The directory will be listening on `http://<YOUR_IP_ADDRESS>:<YOUR_PORT>`.  
The UI will be available at `http://<YOUR_IP_ADDRESS>:<YOUR_PORT>/ui`.

## API Specification

The [specification](https://github.com/ejp-rd-vp/query-builder-catalogue-directory/blob/master/directory/specification.yaml "https://github.com/ejp-rd-vp/query-builder-catalogue-directory/blob/master/directory/specification.yaml") of the central catalogue directory API is based on the [OpenAPI specifictaion](http://spec.openapis.org/oas/v3.0.3 "http://spec.openapis.org/oas/v3.0.3").

## API Usage

Append the following API endpoints to the directories' address:

- `/getCatalogues` returns a list of all stored catalogues as JSON string.
- `/getCatalogues/biobanks` returns a list of all stored biobank catalogues as JSON string.
- `/getCatalogues/registries` returns a list of all stored registry catalogues as JSON string.
- `/getCatalogues/<ID>` returns the catalogue with \$ID as JSON string.
