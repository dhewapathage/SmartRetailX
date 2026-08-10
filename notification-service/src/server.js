const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const {
    startCancellationConsumer
} = require(
    "./messaging/cancellationConsumer"
);


const notificationRoutes =
    require("./routes/notificationRoutes");


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
    "/api/v1/notifications",
    notificationRoutes
);


app.get(
    "/api/v1/health",
    (req, res) => {

        res.status(200).json({
            service:
                "Notification Service",

            status:
                "healthy"
        });

    }
);


const PORT =
    process.env.PORT || 3006;


const startServer = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );


        console.log(
            "Connected to Notification MongoDB"
        );


        const channel =
            await connectRabbitMQ();


        await startOrderConsumer(
            channel
        );
        await startCancellationConsumer(channel);


        app.listen(
            PORT,
            () => {

                console.log(
                    `Notification Service running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Notification Service failed:",
            error.message
        );

    }
};


startServer();