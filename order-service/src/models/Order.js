const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },

        idempotencyKey: {
            type: String,
            trim: true
        },

        items: {
            type: [orderItemSchema],
            required: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "CANCELLED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);


// Prevent duplicate checkout requests.
// Partial index allows older orders without an idempotency key.
orderSchema.index(
    {
        userId: 1,
        idempotencyKey: 1
    },
    {
        unique: true,
        partialFilterExpression: {
            idempotencyKey: {
                $type: "string"
            }
        }
    }
);


module.exports = mongoose.model(
    "Order",
    orderSchema
);