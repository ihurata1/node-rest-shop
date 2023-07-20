
const db = require("../../config/db.js");
const mongoose = require("mongoose");


const { Schema } = mongoose;

const orderSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true
    },
    quantity: { type: Number, default: 1 } // if quantity not set by the user then it default value which is 1 in this case.


}, { timestamps: true });

module.exports = db.model("Order", orderSchema);