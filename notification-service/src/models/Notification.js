const mongoose = require("mongoose");

const notificationSchema =
    new mongoose.Schema(
        {
            userId: {
                type: String,
                required: true
            },

            orderId: {
                type: String,
                required: true
            },

            type: {
                type: String,
                default: "ORDER_CONFIRMATION"
            },

            message: {
                type: String,
                required: true
            },

            status: {
                type: String,
                enum: [
                    "SENT",
                    "FAILED"
                ],
                default: "SENT"
            }
        },
        {
            timestamps: true
        }
    );


module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );