const express = require("express");

const {
    createInventory,
    getInventory
} = require("../controllers/inventoryController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/inventory:
 *   post:
 *     summary: Create inventory for a product
 *     tags:
 *       - Inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantityAvailable
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a797c3a2db070dba7f5cceb
 *               quantityAvailable:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *     responses:
 *       201:
 *         description: Inventory created successfully
 *       400:
 *         description: Invalid inventory data
 *       500:
 *         description: Failed to create inventory
 */
router.post(
    "/",
    createInventory
);


/**
 * @openapi
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory records
 *     tags:
 *       - Inventory
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *       500:
 *         description: Failed to retrieve inventory
 */
router.get(
    "/",
    getInventory
);


module.exports = router;