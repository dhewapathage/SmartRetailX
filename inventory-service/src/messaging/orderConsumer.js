const Inventory =
    require("../models/Inventory");

const {
    publishEvent
} = require("./rabbitmq");


const startOrderConsumer = async (channel) => {

    const queueName = "order.created";

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

                const event = JSON.parse(
                    msg.content.toString()
                );

                console.log(
                    "Order event received:",
                    event
                );

                const inventory =
                    await Inventory.findOne({
                        productId:
                            event.productId
                    });

                if (!inventory) {

                    console.log(
                        "Inventory not found"
                    );

                    await publishEvent(
                        "inventory.failed",
                        {
                            orderId:
                                event.orderId,
                            reason:
                                "Inventory not found"
                        }
                    );

                    channel.ack(msg);
                    return;
                }


                if (
                    inventory.quantityAvailable <
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
                            reason:
                                "Insufficient inventory"
                        }
                    );

                    channel.ack(msg);
                    return;
                }


                inventory.quantityAvailable -=
                    event.quantity;

                inventory.quantityReserved +=
                    event.quantity;

                await inventory.save();

                console.log(
                    `Reserved ${event.quantity} units`
                );


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
                            event.totalAmount
                    }
                );


                channel.ack(msg);

            } catch (error) {

                console.error(
                    "Event processing failed:",
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
    startOrderConsumer
};