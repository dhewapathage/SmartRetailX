const mongoose = require("mongoose");

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
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Inventory", inventorySchema);