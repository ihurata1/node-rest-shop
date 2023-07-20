const mongoose = require("mongoose");

const connection = mongoose.createConnection("mongodb://127.0.0.1:27017/MyShop").on("open", () => {  // if connection successful
    console.log("MongoDb Connected");
}).on("error", () => {
    console.log("MongoDb connection error");
});
module.exports = connection;
