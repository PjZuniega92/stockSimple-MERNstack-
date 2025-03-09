const express = require("express");
const router = express.Router();
const { createInventory, getAllInventories, getInventoryById, deleteInventoryById, updateInventoryById, deleteAllInventories } = require("../controllers/inventory");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST: create a new inventory
// Path: http://localhost:3000/api/inventory
router.post("/", createInventory);

// GET: get all inventories
// Path: http://localhost:3000/api/inventory
router.get("/", getAllInventories);

// DELETE: delete all inventories
// Path: http://localhost:3000/api/inventories
router.delete("/", deleteAllInventories);

// GET: get a specific inventory by ID
// Path: http://localhost:3000/api/inventory/:id
router.get("/:id", getInventoryById);

// DELETE: delete a specific inventory by ID
// Path: http://localhost:3000/api/inventory/:id
router.delete("/:id", deleteInventoryById);

// PUT: udpate a specific inventory by ID
// PATH: http://localhost:3000/api/inventory/:id
router.put("/:id", updateInventoryById);
  

module.exports = router;