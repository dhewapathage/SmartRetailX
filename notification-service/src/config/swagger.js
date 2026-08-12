const swaggerJsdoc = require("swagger-jsdoc");

const options = {

    definition: {

        openapi: "3.0.0",

        info: {
            title:
                "SmartRetailX Notification Service API",

            version: "1.0.0",

            description:
                "API documentation for the SmartRetailX Notification Service"
        },

        servers: [
            {
                url:
                    "http://localhost:3006",

                description:
                    "Local development server"
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


module.exports =
    swaggerJsdoc(options);