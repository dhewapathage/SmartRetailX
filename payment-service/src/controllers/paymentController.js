const Payment = require("../models/Payment");


const getPayments = async (req, res) => {
    try {

        const payments =
            await Payment.find();

        res.status(200).json(payments);

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve payments",
            error: error.message
        });
    }
};


const getPaymentByOrderId = async (req, res) => {
    try {

        const payment =
            await Payment.findOne({
                orderId: req.params.orderId
            });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve payment",
            error: error.message
        });
    }
};


module.exports = {
    getPayments,
    getPaymentByOrderId
};