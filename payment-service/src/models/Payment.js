const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },

        userId: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "COMPLETED",
                "FAILED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);