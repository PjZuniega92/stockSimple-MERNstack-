// tracks stock levels at different locations.

const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

// const db = mongoose.connection.useDb("inventory");
const Inventory = mongoose.model("Inventory", inventorySchema); 

module.exports = Inventory;