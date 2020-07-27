# EJP-RD - Central query portal and Central catalogue directory

A draft of the EJP-RD - 'Central query portal' and 'Central catalogue directory' components. 
The portal can be used to validate developed catalogue APIs. 
The directory can be used to fetch, add and remove catalogue addresses via HTTP requests.

## Requirements

- [Node.js](https://nodejs.org/ "https://nodejs.org/")

## Deployment

### Catalogue Directory

- `cd catalogueDirectory`
- `npm i` to install missing dependencies.
- `node catalogueDirectory.js $PORT` to start the web service.
- The directory will be listening on `http://localhost:$PORT`.

### Query Portal

- `cd portal`
- `npm i` to install missing dependencies.
- `node portal.js $PORT $DIRECTORY_HOST $DIRECTORY_PORT` to start the web service.
- The portal will be available at `http://localhost:$PORT` and retrieve catalogue address information from `http://$DIRECTORY_HOST:$DIRECTORY_PORT`.

## Used Libraries

- [Express](https://expressjs.com/ "https://expressjs.com/") to host the HTTP server.
- [NeDB](https://dbdb.io/db/nedb "https://dbdb.io/db/nedb") to create a database.
- [Helmet](https://helmetjs.github.io/ "https://helmetjs.github.io/") to secure the servers' API.
- [Morgan](https://www.npmjs.com/package/morgan "https://www.npmjs.com/package/morgan") to do logging.
- [CORS](https://expressjs.com/en/resources/middleware/cors.html "https://expressjs.com/en/resources/middleware/cors.html") to allow access from different origins.
- [Express-JWT](https://github.com/auth0/express-jwt "https://github.com/auth0/express-jwt") to validate JWTs (JSON Web Tokens).
- [JWKS-RSA](https://github.com/auth0/node-jwks-rsa "https://github.com/auth0/node-jwks-rsa") to retrieve RSA public keys from a JWKS (JSON Web Key Set).
- [Node-Fetch](https://www.npmjs.com/package/node-fetch "https://www.npmjs.com/package/node-fetch") to enable the fetch function within Node.js.
- [Jest](https://www.npmjs.com/package/jest "https://www.npmjs.com/package/jest") for testing.
