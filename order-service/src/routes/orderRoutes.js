const express = require("express");

const {
    authenticate
} = require("../middleware/authMiddleware");

const {
    createOrder,
    getOrders,
    getOrderById
} = require("../controllers/orderController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a pending order and publishes an order.created event.
 *     tags:
 *       - Orders
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6a797c3a2db070dba7f5cceb
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               simulatePaymentFailure:
 *                 type: boolean
 *                 example: false
 *                 description: Development testing flag used to simulate payment failure.
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid order data or unavailable product
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to create order
 */
router.post(
    "/",
    authenticate,
    createOrder
);


/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to retrieve orders
 */
router.get(
    "/",
    authenticate,
    getOrders
);


/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Failed to retrieve order
 */
router.get(
    "/:id",
    authenticate,
    getOrderById
);


module.exports = router;