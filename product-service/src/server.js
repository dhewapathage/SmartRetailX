const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./config/swagger");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/api/v1/products", productRoutes);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        service: "Product Catalogue Service",
        status: "healthy"
    });
});

const PORT = process.env.PORT || 3002;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {

        console.log("Connected to Product MongoDB");

        app.listen(PORT, () => {
            console.log(
                `Product Service running on port ${PORT}`
            );
        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });