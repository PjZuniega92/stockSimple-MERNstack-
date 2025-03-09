const { response } = require('express');
const Inventory = require("../models/Inventory");


// POST: create a new inventory
const createInventory = async (request, response) => {
    const { productName, quantity, location } = request.body;

    try {
        // const post = await Inventory.create({
        //     productName,
        //     quantity,
        //     location,
        // });

        const data = Array.isArray(request.body) ? request.body : [request.body];
        const posts = await Inventory.create(data);
        response.status(201).json(posts);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

// GET: get all inventories
const getAllInventories = async (request, response) => {
    try {
        const inventories = await Inventory.find().populate("productId", "name");
        response.status(200).json(inventories);
    } catch (error) {
        console.error("Error fetching inventories:", error);
        response.status(400).json({ error: error.message });
    }
};


// DELETE: Delete all inventories
const deleteAllInventories = async (request, response) => {
    try {
        const result = await Inventory.deleteMany({});
        response.status(200).json({ message: "All inventories deleted successfully.", deletedCount: result.deletedCount });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

// GET: get a specific inventory by ID
const getInventoryById = async (request, response) => {
    const { id } = request.params;

    try {
        const inventory = await Inventory.findById({ _id: id})
        if (!inventory) return response.status(404).json({ message: `Inventory with ID: ${id} not found.`});
        response.status(200).json(inventory);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// DELETE: delete a specific inventory by ID
const deleteInventoryById = async (request, response) => {
    const { id } = request.params;

    try {
        const inventory = await Inventory.findByIdAndDelete({ _id: id });

        if (!inventory) return response.status(404).json({ message: `Inventory with Id: ${id} not found.` });
        response.status(200).json({ message: `Inventory with ID: ${id} deleted successfully.` });
    } catch (error) {
        response.status(400).json({ error: error.message });

    }
}

// UPDATE: update a specific inventory by ID
const updateInventoryById = async (request, response) => {
    const { id } = request.params;

    try {
        const inventory = await Inventory.findByIdAndUpdate(
            { _id: id},
            { ...request.body },
            { new: true, runValidators: true }
        );
        if (!inventory) return response.status(404).json({ message: `inventory with ID: ${id} not found.` });
        response.status(200).json({ message: `The post has been updated successfully.`, inventory, });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

module.exports = {
    createInventory,
    getAllInventories,
    getInventoryById,
    deleteInventoryById,
    updateInventoryById,
    deleteAllInventories
}