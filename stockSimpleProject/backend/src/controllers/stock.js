const { response } = require('express');
const Stock = require("../models/Stock");


// POST: create a new stock
const createStock = async (request, response) => {
    const { productId, quantityAdded, location, supplier } = request.body;

    try {
        if (!productId || !quantityAdded || !location) {
            return response.status(400).json({ message: "Missing required fields" });
        }

        // Check if stock already exists for this product and location
        let existingStock = await Stock.findOne({ productId, location });

        if (existingStock) {
            // Update the quantity instead of creating a new entry
            existingStock.quantityAdded += quantityAdded;
            await existingStock.save();
            return response.status(200).json({ message: "Stock updated successfully!", stock: existingStock });
        } 

        // Otherwise, create a new stock entry
        const newStock = await Stock.create({ productId, quantityAdded, location, supplier });
        response.status(201).json(newStock);
    } catch (error) {
        console.error("Error saving stock:", error);
        response.status(400).json({ message: "Failed to save stock", error: error.message });
    }
};


// GET: get all stocks
const getAllStocks = async (request, response) => {
    try {
        const stocks = await Stock.find()
            .populate("productId", "name") 
            .select("quantityAdded supplier productId location dateAdded");

        response.status(200).json({
            stocks: stocks.map(stock => ({
                name: stock.productId?.name || "Unknown Product",
                totalQuantity: stock.quantityAdded,
                supplier: stock.supplier || "Unknown Supplier",
                location: stock.location || "Unknown Location",
                dateAdded: stock.dateAdded || "No Date Available"
            })),
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        response.status(400).json({ message: "Failed to fetch stocks", error: error.message });
    }
};


// GET: get a specific stock by ID
const getStockById = async (request, response) => {
    const { id } = request.params;

    try {
        const stock = await Stock.findById({ _id: id})
        if (!stock) return response.status(404).json({ message: `Stock with ID: ${id} not found.`});
        response.status(200).json(stock);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// DELETE: delete a specific stock by ID
const deleteStockById = async (request, response) => {
    const { id } = request.params;

    try {
        const stock = await Stock.findByIdAndDelete({ _id: id });

        if (!stock) return response.status(404).json({ message: `Stock with Id: ${id} not found.` });
        response.status(200).json({ message: `Stock with ID: ${id} deleted successfully.` });
    } catch (error) {
        response.status(400).json({ error: error.message });

    }
}

// UPDATE: update a specific stock by ID
const updateStockById = async (request, response) => {
    const { id } = request.params;
    const { quantityAdded } = request.body;

    try {
        const stock = await Stock.findByIdAndUpdate(
            { _id: id},
            { quantityAdded },
            { new: true, runValidators: true }
        );
        if (!stock) {
            return response.status(404).json({ message: `stock with ID: ${id} not found.` });
        }
        response.status(200).json({ message: `The post has been updated successfully.`, stock });
    } catch (error) {
        console.error("Error updating stock:", error.message);
        response.status(400).json({ error: error.message });
    }
}

module.exports = {
    createStock,
    getAllStocks,
    getStockById,
    deleteStockById,
    updateStockById,
}