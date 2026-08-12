const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        reservedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);


const inventorySchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true
        },

        quantityAvailable: {
            type: Number,
            required: true,
            min: 0
        },

        quantityReserved: {
            type: Number,
            default: 0,
            min: 0
        },

        reservations: {
            type: [reservationSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Inventory",
        inventorySchema
    );