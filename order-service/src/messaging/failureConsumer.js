const Order = require("../models/Order");

const {
    publishEvent
} = require("./rabbitmq");


const startFailureConsumers = async (channel) => {

    // --------------------------------
    // Inventory failure
    // --------------------------------

    await channel.assertQueue(
        "inventory.failed",
        {
            durable: true
        }
    );

    console.log(
        "Order Service waiting for inventory.failed events..."
    );

    channel.consume(
        "inventory.failed",
        async (msg) => {

            if (!msg) return;

            try {

                const event = JSON.parse(
                    msg.content.toString()
                );

                console.log(
                    "Inventory failure received:",
                    event
                );


                const order =
                    await Order.findById(
                        event.orderId
                    );


                if (!order) {

                    channel.ack(msg);
                    return;
                }


                order.status = "CANCELLED";

                await order.save();


                console.log(
                    `Order ${order._id} cancelled because inventory failed`
                );


                await publishEvent(
                    "order.cancelled",
                    {
                        orderId:
                            order._id.toString(),

                        userId:
                            order.userId,

                        reason:
                            event.reason
                    }
                );


                channel.ack(msg);

            } catch (error) {

                console.error(
                    "inventory.failed processing error:",
                    error.message
                );

                channel.nack(
                    msg,
                    false,
                    false
                );
            }
        }
    );


    // --------------------------------
    // Payment failure
    // --------------------------------

    await channel.assertQueue(
        "payment.failed",
        {
            durable: true
        }
    );

    console.log(
        "Order Service waiting for payment.failed events..."
    );


    channel.consume(
        "payment.failed",
        async (msg) => {

            if (!msg) return;

            try {

                const event = JSON.parse(
                    msg.content.toString()
                );


                console.log(
                    "Payment failure received:",
                    event
                );


                const order =
                    await Order.findById(
                        event.orderId
                    );


                if (!order) {

                    channel.ack(msg);
                    return;
                }


                order.status = "CANCELLED";

                await order.save();


                console.log(
                    `Order ${order._id} cancelled because payment failed`
                );


                // Tell Inventory Service
                // to undo the reservation

                await publishEvent(
                    "inventory.release",
                    {
                        orderId:
                            event.orderId,

                        productId:
                            event.productId,

                        quantity:
                            event.quantity
                    }
                );


                await publishEvent(
                    "order.cancelled",
                    {
                        orderId:
                            event.orderId,

                        userId:
                            order.userId,

                        reason:
                            event.reason
                    }
                );


                channel.ack(msg);

            } catch (error) {

                console.error(
                    "payment.failed processing error:",
                    error.message
                );

                channel.nack(
                    msg,
                    false,
                    false
                );
            }
        }
    );
};


module.exports = {
    startFailureConsumers
};