const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "SmartRetailX Order Service API",
            version: "1.0.0",
            description:
                "API documentation for the SmartRetailX Order Service"
        },

        servers: [
            {
                url: "http://localhost:3003",
                description: "Local development server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec =
    swaggerJsdoc(options);

module.exports = swaggerSpec;