# EJP - Central query portal - Catalogue directory

The EJP - central query portal - catalogue directory component.

## Requirements

- Node.js (https://nodejs.org/)

## Deployment

- `cd catalogueDirectory`
- `npm i` to install missing dependencies.
- `node catalogueDirectory.js` to start the catalogue directory server.
- The portal will be available at http://localhost:3000.

## Used Libraries

- Express (https://expressjs.com/) to run a http server.
- NeDB (https://dbdb.io/db/nedb) to create a database.
- Helmet (https://helmetjs.github.io/) to secure the servers' API.
- Morgan (https://www.npmjs.com/package/morgan) to do logging.
- CORS (https://expressjs.com/en/resources/middleware/cors.html) to allow access from different origins.
- Auth0 Express-JWT (https://github.com/auth0/express-jwt) to validate JWTs (JSON Web Tokens).
- Auth0 JWKS-RSA (https://github.com/auth0/node-jwks-rsa) to retrieve RSA public keys from a JWKS (JSON Web Key Set).
