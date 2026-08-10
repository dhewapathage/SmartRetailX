const Product = require("../models/Product");

// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            stock,
            sku
        } = req.body;

        const existingProduct = await Product.findOne({ sku });

        if (existingProduct) {
            return res.status(400).json({
                message: "Product with this SKU already exists"
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            price,
            stock,
            sku
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};


// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            active: true
        });

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve products",
            error: error.message
        });
    }
};


// Get one product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve product",
            error: error.message
        });
    }
};


// Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};