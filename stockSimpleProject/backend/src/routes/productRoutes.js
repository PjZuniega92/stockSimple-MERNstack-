const express = require("express");
const router = express.Router();
const { createProduct, getAllProducts, getProductById, deleteProductById, updateProductById, deleteAllProducts } = require("../controllers/product");

// POST: create a new Product
// Path: http://localhost:3000/api/products
router.post("/", createProduct);

// GET: get all products
// Path: http://localhost:3000/api/products
router.get("/", getAllProducts);

// DELETE: delete all inventories
// Path: http://localhost:3000/api/products
router.delete("/", deleteAllProducts);

// GET: get a specific Product by ID
// Path: http://localhost:3000/api/products/:id
router.get("/:id", getProductById);

// DELETE: delete a specific Product by ID
// Path: http://localhost:3000/api/products/:id
router.delete("/:id", deleteProductById);

// PUT: udpate a specific Product by ID
// PATH: http://localhost:3000/api/products/:id
router.put("/:id", updateProductById);

module.exports = router;