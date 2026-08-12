const express = require("express");

const {
    getPayments,
    getPaymentByOrderId
} = require("../controllers/paymentController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       500:
 *         description: Failed to retrieve payments
 */
router.get(
    "/",
    getPayments
);


/**
 * @openapi
 * /api/v1/payments/order/{orderId}:
 *   get:
 *     summary: Get payment by order ID
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Failed to retrieve payment
 */
router.get(
    "/order/:orderId",
    getPaymentByOrderId
);


module.exports = router;