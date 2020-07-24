# EJP-RD - Central query portal and Central catalogue directory

A draft of the EJP-RD - 'Central query portal' and 'Central catalogue directory' components. 
The portal can be used to validate developed catalogue APIs. 
The directory can be used to fetch, add and remove catalogue addresses via HTTP requests.

## Requirements

- Node.js (https://nodejs.org/)

## Deployment

### Catalogue Directory

- `cd catalogueDirectory`
- `npm i` to install missing dependencies.
- `node catalogueDirectory.js` to start the Web-Service.
- The directory will be available at http://localhost:3001.

### Query Portal

- `cd portal`
- `npm i` to install missing dependencies.
- `node portal.js` to start the Web-Service.
- The portal will be available at http://localhost:3002.

## Used Libraries

- [Express](https://expressjs.com/ "https://expressjs.com/") to run a http server.
- [NeDB](https://dbdb.io/db/nedb "https://dbdb.io/db/nedb") to create a database.
- [Helmet](https://helmetjs.github.io/ "https://helmetjs.github.io/") to secure the servers' API.
- [Morgan](https://www.npmjs.com/package/morgan "https://www.npmjs.com/package/morgan") to do logging.
- [CORS](https://expressjs.com/en/resources/middleware/cors.html "https://expressjs.com/en/resources/middleware/cors.html") to allow access from different origins.
- [Express-JWT](https://github.com/auth0/express-jwt "https://github.com/auth0/express-jwt") to validate JWTs (JSON Web Tokens).
- [JWKS-RSA](https://github.com/auth0/node-jwks-rsa "https://github.com/auth0/node-jwks-rsa") to retrieve RSA public keys from a JWKS (JSON Web Key Set).
- [Node-Fetch](https://www.npmjs.com/package/node-fetch "https://www.npmjs.com/package/node-fetch") to enable the fetch function within Node.js
- [Dotenv](https://www.npmjs.com/package/dotenv "https://www.npmjs.com/package/dotenv") to enable the use of environenment variables.
- [Jest](https://www.npmjs.com/package/jest "https://www.npmjs.com/package/jest") for testing.
