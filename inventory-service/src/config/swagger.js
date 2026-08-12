const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "SmartRetailX Inventory Service API",
            version: "1.0.0",
            description:
                "API documentation for the SmartRetailX Inventory Service"
        },

        servers: [
            {
                url: "http://localhost:3004",
                description: "Local development server"
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;