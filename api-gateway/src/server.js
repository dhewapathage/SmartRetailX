const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();


const app = express();


app.use(cors());
app.use(express.json());


const PORT =
    process.env.PORT || 8081;


/*
    Internal Docker service URLs
*/
const services = {

    user:
        process.env.USER_SERVICE_URL,

    product:
        process.env.PRODUCT_SERVICE_URL,

    order:
        process.env.ORDER_SERVICE_URL,

    inventory:
        process.env.INVENTORY_SERVICE_URL,

    notification:
        process.env.NOTIFICATION_SERVICE_URL
};


/*
    API Gateway health endpoint
*/
app.get(
    "/api/v1/health",
    (req, res) => {

        res.status(200).json({
            service:
                "SmartRetailX API Gateway",

            status:
                "healthy"
        });
    }
);


/*
    Generic request forwarding function
*/
const forwardRequest = async (
    req,
    res,
    targetService
) => {

    try {

        /*
            Preserve important headers including:
            - JWT Authorization
            - Idempotency-Key
        */
        const forwardedHeaders = {
            ...req.headers
        };


        delete forwardedHeaders.host;
        delete forwardedHeaders["content-length"];
        delete forwardedHeaders.connection;


        /*
            originalUrl keeps the complete
            /api/v1/... route.
        */
        const path =
            req.originalUrl.split("?")[0];


        const targetUrl =
            `${targetService}${path}`;


        console.log(
            `${req.method} ${req.originalUrl} -> ${targetUrl}`
        );


        const response =
            await axios({

                method:
                    req.method,

                url:
                    targetUrl,

                headers:
                    forwardedHeaders,

                params:
                    req.query,

                data:
                    ["GET", "HEAD"].includes(
                        req.method
                    )
                        ? undefined
                        : req.body,

                validateStatus:
                    () => true
            });


        if (
            response.headers[
                "content-type"
            ]
        ) {

            res.set(
                "Content-Type",
                response.headers[
                    "content-type"
                ]
            );
        }


        return res
            .status(response.status)
            .send(response.data);


    } catch (error) {

        console.error(
            "Gateway forwarding error:",
            error.message
        );


        return res.status(502).json({

            message:
                "API Gateway could not reach the requested service",

            error:
                error.message
        });
    }
};


/*
    USER SERVICE
*/
app.use(
    "/api/v1/auth",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.user
        )
);


app.use(
    "/api/v1/users",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.user
        )
);


/*
    PRODUCT SERVICE
*/
app.use(
    "/api/v1/products",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.product
        )
);


/*
    ORDER SERVICE
*/
app.use(
    "/api/v1/orders",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.order
        )
);


/*
    INVENTORY SERVICE
*/
app.use(
    "/api/v1/inventory",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.inventory
        )
);


/*
    NOTIFICATION SERVICE
*/
app.use(
    "/api/v1/notifications",
    (req, res) =>
        forwardRequest(
            req,
            res,
            services.notification
        )
);


/*
    Unknown gateway route
*/
app.use(
    (req, res) => {

        res.status(404).json({
            message:
                "API Gateway route not found"
        });
    }
);


app.listen(
    PORT,
    () => {

        console.log(
            `SmartRetailX API Gateway running on port ${PORT}`
        );
    }
);