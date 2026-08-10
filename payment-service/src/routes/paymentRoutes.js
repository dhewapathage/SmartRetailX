const express = require("express");

const {
    getPayments,
    getPaymentByOrder
} = require(
    "../controllers/paymentController"
);

const router =
    express.Router();

router.get(
    "/",
    getPayments
);

router.get(
    "/order/:orderId",
    getPaymentByOrder
);

module.exports = router;