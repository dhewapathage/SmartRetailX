const express = require("express");

const {
    createInventory,
    getInventory
} = require("../controllers/inventoryController");

const {
    authenticate,
    authorizeRoles
} = require("../middleware/authMiddleware");


const router = express.Router();


/**
 * @openapi
 * /api/v1/inventory:
 *   post:
 *     summary: Create inventory for a product
 *     description: ADMIN access only
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN access required
 *       500:
 *         description: Failed to create inventory
 */
router.post(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    createInventory
);


/**
 * @openapi
 * /api/v1/inventory:
 *   get:
 *     summary: Get all inventory records
 *     description: Available to authenticated users
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to retrieve inventory
 */
router.get(
    "/",
    authenticate,
    getInventory
);


module.exports = router;