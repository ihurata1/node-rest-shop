
const db = require("../../config/db.js");
const mongoose = require("mongoose");


const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = db.model("Product", productSchema);