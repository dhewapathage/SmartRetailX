const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const {
    startReleaseConsumer
} = require("./messaging/releaseConsumer");

const inventoryRoutes =
    require("./routes/inventoryRoutes");

const {
    connectRabbitMQ
} = require("./messaging/rabbitmq");

const {
    startOrderConsumer
} = require("./messaging/orderConsumer");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api/v1/inventory",
    inventoryRoutes
);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        service: "Inventory Management Service",
        status: "healthy"
    });
});

const PORT = process.env.PORT || 3004;

const startServer = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "Connected to Inventory MongoDB"
        );

        const channel =
            await connectRabbitMQ();

        await startOrderConsumer(channel);
        await startReleaseConsumer(channel);

        app.listen(PORT, () => {
            console.log(
                `Inventory Service running on port ${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Inventory Service failed:",
            error.message
        );
    }
};

startServer();