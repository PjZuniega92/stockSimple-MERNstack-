// logs stock changes (e.g., restocks from suppliers).

const mongoose = require("mongoose");
const { baseModelName } = require("./Inventory");

const stockSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantityAdded: {type: Number, required: true},
    dateAdded: {type: Date, default: Date.now},
    supplier: { type: String, default: "Unknown Supplier" },
    location: { type: String, required: true }
});

// const db = mongoose.connection.useDb("stock");
const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;