# EJP-RD - Central catalogue directory

A draft of the EJP-RD - 'Central catalogue directory' component.
The directory can be used to fetch, add and remove catalogue addresses via HTTP requests.

## Requirements

- [Node.js](https://nodejs.org/ "https://nodejs.org/")

## Deployment

- `cd directory`.
- `npm i` to install missing dependencies.
- Create a file named `.env` in the `directory` folder for environenment variable specification.
- Set the database file path inside the `.env` file as follows: `DATABASE_PATH=$PATH_TO_YOUR_DATABASE_FILE`, e.g.: `DATABASE_PATH=database.json`. Note that this file needs to exist in order for the server to operate correctly.
- `node src/catalogueDirectory.js $HTTP_PORT` to start the web service.
- The directory will be listening on `http://localhost:$HTTP_PORT`.

## Used Libraries

- [Express](https://expressjs.com/ "https://expressjs.com/") to host the HTTP server.
- [NeDB](https://dbdb.io/db/nedb "https://dbdb.io/db/nedb") to create a database.
- [Helmet](https://helmetjs.github.io/ "https://helmetjs.github.io/") to secure the servers' API.
- [Morgan](https://www.npmjs.com/package/morgan "https://www.npmjs.com/package/morgan") to do logging.
- [CORS](https://expressjs.com/en/resources/middleware/cors.html "https://expressjs.com/en/resources/middleware/cors.html") to allow access from different origins.
- [Express-JWT](https://github.com/auth0/express-jwt "https://github.com/auth0/express-jwt") to validate JWTs (JSON Web Tokens).
- [JWKS-RSA](https://github.com/auth0/node-jwks-rsa "https://github.com/auth0/node-jwks-rsa") to retrieve RSA public keys from a JWKS (JSON Web Key Set).
- [Dotenv](https://github.com/motdotla/dotenv "https://github.com/motdotla/dotenv") to support environenment variables inside Node.js.
- [Jest](https://www.npmjs.com/package/jest "https://www.npmjs.com/package/jest") for testing.

## API Specification

The [specification](https://github.com/ejp-rd-vp/query-builder-catalogue-directory/blob/master/directory/specification.yaml "https://github.com/ejp-rd-vp/query-builder-catalogue-directory/blob/master/directory/specification.yaml") of the central catalogue directory API is based on the [OpenAPI specifictaion](http://spec.openapis.org/oas/v3.0.3 "http://spec.openapis.org/oas/v3.0.3").
