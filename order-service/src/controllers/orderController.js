const axios = require("axios");
const Order = require("../models/Order");

const {
    publishOrderCreated
} = require("../messaging/rabbitmq");


const createOrder = async (req, res) => {

    try {

        const {
            productId,
            quantity,
            simulatePaymentFailure = false
        } = req.body;

        const userId = req.user.userId;

        // Unique key sent by the frontend for this checkout attempt
        const idempotencyKey =
            req.get("Idempotency-Key");


        if (!productId || !quantity || Number(quantity) < 1) {

            return res.status(400).json({
                message:
                    "productId and valid quantity are required"
            });

        }


        if (!idempotencyKey) {

            return res.status(400).json({
                message:
                    "Idempotency-Key header is required"
            });

        }


        /*
         * Check whether this exact request
         * has already created an order.
         */
        const existingOrder = await Order.findOne({
            userId,
            idempotencyKey
        });


        if (existingOrder) {

            return res.status(200).json({

                message:
                    "Order already created for this request",

                duplicatePrevented: true,

                order:
                    existingOrder
            });

        }


        // Get trusted product data from Product Service
        const productResponse = await axios.get(

            `${process.env.PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,

            {
                headers: {
                    Authorization:
                        req.headers.authorization
                }
            }

        );


        const product =
            productResponse.data;


        if (!product.active) {

            return res.status(400).json({
                message:
                    "Product is not available"
            });

        }


        // Calculate price using trusted Product Service data
        const totalAmount =
            Number(product.price) *
            Number(quantity);


        // Create the order
        const order = await Order.create({

            userId,

            idempotencyKey,

            items: [
                {
                    productId:
                        product._id,

                    productName:
                        product.name,

                    quantity:
                        Number(quantity),

                    unitPrice:
                        product.price
                }
            ],

            totalAmount,

            status:
                "PENDING"
        });


        // Publish event only for the newly-created order
        await publishOrderCreated({

            orderId:
                order._id.toString(),

            userId:
                userId.toString(),

            productId:
                product._id.toString(),

            quantity:
                Number(quantity),

            totalAmount,

            simulatePaymentFailure
        });


        return res.status(201).json({

            message:
                "Order created successfully",

            duplicatePrevented:
                false,

            order
        });


    } catch (error) {

        /*
         * Handles two requests arriving almost
         * at exactly the same time.
         *
         * MongoDB unique index will reject
         * the second one.
         */
        if (error.code === 11000) {

            const idempotencyKey =
                req.get("Idempotency-Key");

            const existingOrder =
                await Order.findOne({

                    userId:
                        req.user.userId,

                    idempotencyKey
                });


            if (existingOrder) {

                return res.status(200).json({

                    message:
                        "Duplicate order request prevented",

                    duplicatePrevented:
                        true,

                    order:
                        existingOrder
                });

            }

        }


        if (error.response?.status === 404) {

            return res.status(404).json({
                message:
                    "Product not found"
            });

        }


        return res.status(500).json({

            message:
                "Failed to create order",

            error:
                error.message
        });

    }
};



const getOrders = async (req, res) => {

    try {

        const userId =
            req.user.userId;


        const orders =
            await Order.find({
                userId
            }).sort({
                createdAt: -1
            });


        return res.status(200).json(
            orders
        );


    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to retrieve orders",

            error:
                error.message
        });

    }
};



const getOrderById = async (req, res) => {

    try {

        const userId =
            req.user.userId;


        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                userId
            });


        if (!order) {

            return res.status(404).json({
                message:
                    "Order not found"
            });

        }


        return res.status(200).json(
            order
        );


    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to retrieve order",

            error:
                error.message
        });

    }
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById
};