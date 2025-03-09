const { response } = require('express');
const Product = require("../models/Product");


// POST: create a new product
const createProduct = async (request, response) => {
    const { name, price, category, stock, description, image } = request.body;

    try {
        const data = Array.isArray(request.body) ? request.body : [request.body];
        const posts = await Product.create(data);
        response.status(201).json(posts);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

// GET: get all inventories
const getAllProducts = async (request, response) => {
    try {
        const products = await Product.find();
        response.status(200).json(products);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// DELETE: Delete all inventories
const deleteAllProducts = async (request, response) => {
    try {
        const result = await Product.deleteMany({});
        response.status(200).json({ message: "All products deleted successfully.", deletedCount: result.deletedCount });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
};

// GET: get a specific product by ID
const getProductById = async (request, response) => {
    const { id } = request.params;

    try {
        const product = await Product.findById({ _id: id})
        if (!product) return response.status(404).json({ message: `Product with ID: ${id} not found.`});
        response.status(200).json(product);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

// DELETE: delete a specific product by ID
const deleteProductById = async (request, response) => {
    const { id } = request.params;

    try {
        const product = await Product.findByIdAndDelete({ _id: id });

        if (!product) return response.status(404).json({ message: `Product with Id: ${id} not found.` });
        response.status(200).json({ message: `Product with ID: ${id} deleted successfully.` });
    } catch (error) {
        response.status(400).json({ error: error.message });

    }
}

// UPDATE: update a specific product by ID
const updateProductById = async (request, response) => {
    const { id } = request.params;

    try {
        const product = await Product.findByIdAndUpdate(
            { _id: id},
            { ...request.body },
            { new: true, runValidators: true }
        );
        if (!product) return response.status(404).json({ message: `product with ID: ${id} not found.` });
        response.status(200).json({ message: `The post has been updated successfully.`, product, });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProductById,
    updateProductById,
    deleteAllProducts
}