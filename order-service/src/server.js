const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./config/swagger");

const {
    startFailureConsumers
} = require("./messaging/failureConsumer");

const orderRoutes = require("./routes/orderRoutes");
const {
    startPaymentConsumer
} = require("./messaging/paymentConsumer");

const {
    connectRabbitMQ
} = require("./messaging/rabbitmq");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/api/v1/orders", orderRoutes);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        service: "Order Processing Service",
        status: "healthy"
    });
});

const PORT = process.env.PORT || 3003;

const startServer = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "Connected to Order MongoDB"
        );

        const channel =
    await connectRabbitMQ();

await startPaymentConsumer(
    channel
);
await startFailureConsumers(channel);

        app.listen(PORT, () => {
            console.log(
                `Order Service running on port ${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Order Service failed to start:",
            error.message
        );

    }
};

startServer();