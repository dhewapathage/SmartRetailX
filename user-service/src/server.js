const express = require("express");
const mongoose = require("mongoose");
const { getMongoConnection } = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const swaggerUi =
    require("swagger-ui-express");

const swaggerSpec =
    require("./config/swagger");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        service: "User Management Service",
        status: "healthy"
    });
});

const PORT = process.env.PORT || 3001;

mongoose
    .connect(...getMongoConnection("smartretailx"))
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`User Service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
