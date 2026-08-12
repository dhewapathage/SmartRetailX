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


        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                message: "productId and valid quantity are required"
            });
        }


        // Get trusted product information from Product Service
        const productResponse = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );


        const product = productResponse.data;


        if (!product.active) {
            return res.status(400).json({
                message: "Product is not available"
            });
        }


        // Calculate total using trusted product price
        const totalAmount =
            product.price * quantity;


        // Save order
        const order = await Order.create({
            userId,

            items: [
                {
                    productId:
                        product._id,

                    productName:
                        product.name,

                    quantity,

                    unitPrice:
                        product.price
                }
            ],

            totalAmount,

            status: "PENDING"
        });


        // Publish order.created event
        await publishOrderCreated({
            orderId:
                order._id.toString(),

            userId:
                userId.toString(),

            productId:
                product._id.toString(),

            quantity,

            totalAmount,

            simulatePaymentFailure
        });


        res.status(201).json({
            message:
                "Order created successfully",

            order
        });


    } catch (error) {

        if (error.response?.status === 404) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        res.status(500).json({
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
                userId: userId
            }).sort({
                createdAt: -1
            });


        res.status(200).json(
            orders
        );


    } catch (error) {

        res.status(500).json({
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
                _id: req.params.id,
                userId: userId
            });


        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }


        res.status(200).json(
            order
        );


    } catch (error) {

        res.status(500).json({
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