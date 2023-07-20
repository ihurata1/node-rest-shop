const http = require("http");
const app = require("./app");
const db = require("./config/db");
const Product = require("./api/models/product");

const port = process.env.port || 3000;

const server = http.createServer(app);

server.listen(port);
console.log("listening port:" + port);