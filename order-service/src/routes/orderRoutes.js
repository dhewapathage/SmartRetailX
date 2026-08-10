const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById
} = require("../controllers/orderController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createOrder);

router.get("/", authenticate, getOrders);

router.get("/:id", authenticate, getOrderById);

module.exports = router;