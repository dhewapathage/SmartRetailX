const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "SmartRetailX Payment Service API",
            version: "1.0.0",
            description:
                "API documentation for the SmartRetailX Payment Service"
        },

        servers: [
            {
                url: "http://localhost:3005",
                description: "Local development server"
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec =
    swaggerJsdoc(options);

module.exports = swaggerSpec;