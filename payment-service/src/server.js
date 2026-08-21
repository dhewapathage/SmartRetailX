const express = require("express");
const mongoose = require("mongoose");
const { getMongoConnection } = require("./config/database");
const cors = require("cors");

require("dotenv").config();

const paymentRoutes =
    require("./routes/paymentRoutes");

const {
    connectRabbitMQ
} = require("./messaging/rabbitmq");

const {
    startInventoryConsumer
} = require(
    "./messaging/inventoryConsumer"
);
const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(
    "/api/v1/payments",
    paymentRoutes
);


app.get(
    "/api/v1/health",
    (req, res) => {

        res.status(200).json({
            service:
                "Payment Service",

            status:
                "healthy"
        });

    }
);


const PORT =
    process.env.PORT || 3005;


const startServer = async () => {

    try {

        await mongoose.connect(
            ...getMongoConnection("smartretailx_payments")
        );

        console.log(
            "Connected to Payment MongoDB"
        );


        const channel =
            await connectRabbitMQ();


        await startInventoryConsumer(
            channel
        );


        app.listen(
            PORT,
            () => {

                console.log(
                    `Payment Service running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Payment Service failed:",
            error.message
        );

    }

};


startServer();
