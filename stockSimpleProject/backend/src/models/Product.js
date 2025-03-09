// basic product details.

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    material: { type: String },
    size: { type: String },
    description: { type: String }
});

// const db = mongoose.connection.useDb("product");
const Product = mongoose.model("Product", productSchema);

module.exports = Product;