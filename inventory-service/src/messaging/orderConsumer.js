const Inventory =
    require("../models/Inventory");

const {
    publishEvent
} = require("./rabbitmq");

const {
    handleMessageFailure
} = require("./retryHandler");


const publishReservedEvent = async (
    event
) => {

    await publishEvent(
        "inventory.reserved",
        {
            orderId:
                event.orderId,

            userId:
                event.userId,

            productId:
                event.productId,

            quantity:
                event.quantity,

            totalAmount:
                event.totalAmount,

            simulatePaymentFailure:
                event.simulatePaymentFailure
        }
    );
};


const startOrderConsumer =
    async (channel) => {

        const queueName =
            "order.created";


        await channel.assertQueue(
            queueName,
            {
                durable: true
            }
        );


        console.log(
            "Waiting for order.created events..."
        );


        channel.consume(
            queueName,
            async (msg) => {

                if (!msg) return;


                try {

                    const event =
                        JSON.parse(
                            msg.content.toString()
                        );


                    console.log(
                        "Order event received:",
                        event
                    );


                    // Basic event validation
                    if (
                        !event.orderId ||
                        !event.productId ||
                        !event.quantity
                    ) {

                        throw new Error(
                            "Invalid order.created event"
                        );
                    }


                    /*
                     * Atomic reservation:
                     *
                     * 1. Product must have enough stock.
                     * 2. This order must NOT already
                     *    have a reservation.
                     */

                    const inventory =
                        await Inventory.findOneAndUpdate(
                            {
                                productId:
                                    event.productId,

                                quantityAvailable: {
                                    $gte:
                                        event.quantity
                                },

                                "reservations.orderId": {
                                    $ne:
                                        event.orderId
                                }
                            },

                            {
                                $inc: {
                                    quantityAvailable:
                                        -event.quantity,

                                    quantityReserved:
                                        event.quantity
                                },

                                $push: {
                                    reservations: {
                                        orderId:
                                            event.orderId,

                                        quantity:
                                            event.quantity,

                                        reservedAt:
                                            new Date()
                                    }
                                }
                            },

                            {
                                returnDocument: "after"
                            }
                        );


                    // Update didn't happen.
                    if (!inventory) {

                        const currentInventory =
                            await Inventory.findOne({
                                productId:
                                    event.productId
                            });


                        // No inventory record
                        if (!currentInventory) {

                            await publishEvent(
                                "inventory.failed",
                                {
                                    orderId:
                                        event.orderId,

                                    userId:
                                        event.userId,

                                    reason:
                                        "Inventory not found"
                                }
                            );


                            channel.ack(msg);
                            return;
                        }


                        // Check whether this was
                        // a duplicate event.
                        const existingReservation =
                            currentInventory
                                .reservations
                                .find(
                                    reservation =>
                                        reservation.orderId ===
                                        event.orderId
                                );


                        if (existingReservation) {

                            console.log(
                                `Duplicate order.created ignored for order ${event.orderId}`
                            );


                            /*
                             * Re-publish downstream event.
                             * This helps if Inventory was
                             * saved previously but the
                             * inventory.reserved event
                             * was not successfully sent.
                             */
                            await publishReservedEvent(
                                event
                            );


                            channel.ack(msg);
                            return;
                        }


                        // Genuine insufficient stock
                        if (
                            currentInventory
                                .quantityAvailable <
                            event.quantity
                        ) {

                            console.log(
                                "Insufficient inventory"
                            );


                            await publishEvent(
                                "inventory.failed",
                                {
                                    orderId:
                                        event.orderId,

                                    userId:
                                        event.userId,

                                    reason:
                                        "Insufficient inventory"
                                }
                            );


                            channel.ack(msg);
                            return;
                        }


                        /*
                         * If we reach here,
                         * something unexpected happened.
                         * Let retry handling deal with it.
                         */
                        throw new Error(
                            "Inventory reservation conflict"
                        );
                    }


                    console.log(
                        `Reserved ${event.quantity} units for order ${event.orderId}`
                    );


                    await publishReservedEvent(
                        event
                    );


                    channel.ack(msg);


                } catch (error) {

                    console.error(
                        "Inventory event processing failed:",
                        error.message
                    );


                    handleMessageFailure(
                        channel,
                        msg,
                        error
                    );
                }
            }
        );
};


module.exports = {
    startOrderConsumer
};