const express = require("express");

const {
    authenticate
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to retrieve products
 */
router.get(
    "/",
    
    getProducts
);


/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product MongoDB ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Product not found
 */
router.get(
    "/:id",
    
    getProductById
);


/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a product
 *     description: ADMIN access required.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - sku
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smart Watch
 *               description:
 *                 type: string
 *                 example: SmartRetailX fitness smart watch
 *               category:
 *                 type: string
 *                 example: Electronics
 *               price:
 *                 type: number
 *                 example: 24999
 *               stock:
 *                 type: number
 *                 example: 50
 *               sku:
 *                 type: string
 *                 example: SRX-WATCH-001
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN access required
 */
router.post(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    createProduct
);


/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: ADMIN access required.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               sku:
 *                 type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN access required
 *       404:
 *         description: Product not found
 */
router.put(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    updateProduct
);


/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: ADMIN access required.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN access required
 *       404:
 *         description: Product not found
 */
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    deleteProduct
);


module.exports = router;