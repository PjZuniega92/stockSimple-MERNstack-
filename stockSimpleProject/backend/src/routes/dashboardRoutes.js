const express = require("express");
const Product = require("../models/Product");
const Stock = require("../models/Stock");
const Inventory = require("../models/Inventory");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalStocks = await Stock.countDocuments();
    const totalInventory = await Inventory.countDocuments();
    const totalUsers = await User.countDocuments();

    // Aggregate stock quantities per product
    const stocks = await Stock.aggregate([
      { $group: { _id: "$productId", totalQuantity: { $sum: "$quantityAdded" } } },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 0, name: "$product.name", totalQuantity: 1 } },
      { $limit: 5 },
    ]);

    // Aggregate inventory quantities per product
    const inventory = await Inventory.aggregate([
      { $group: { _id: "$productId", totalQuantity: { $sum: "$quantity" } } },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 0, name: "$product.name", totalQuantity: 1 } },
      { $limit: 5 },
    ]);

    // Get latest products
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);

    // Get latest users
    const users = await User.find().sort({ createdAt: -1 }).limit(5);

    response.json({
      totalProducts,
      totalStocks,
      totalInventory,
      totalUsers,
      products,
      stocks,
      inventory,
      users,
    });
  } catch (error) {
    response.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
});

module.exports = router;
