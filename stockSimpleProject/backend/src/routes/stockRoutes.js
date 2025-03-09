const express = require("express");
const router = express.Router();
const { createStock, getAllStocks, getStockById, deleteStockById, updateStockById } = require("../controllers/stock");

// POST: create a new stock
// Path: http://localhost:3000/api/stocks
router.post("/", createStock);

// GET: get all inventories
// Path: http://localhost:3000/api/stocks
router.get("/", getAllStocks);

// GET: get a specific stock by ID
// Path: http://localhost:3000/api/stocks/:id
router.get("/:id", getStockById);

// DELETE: delete a specific stock by ID
// Path: http://localhost:3000/api/stocks/:id
router.delete("/:id", deleteStockById);

// PUT: udpate a specific stock by ID
// PATH: http://localhost:3000/api/stocks/:id
router.put("/:id", updateStockById);

module.exports = router;