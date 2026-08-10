const Notification =
    require("../models/Notification");


const startOrderConsumer =
    async (channel) => {

        const queueName =
            "order.confirmed";


        await channel.assertQueue(
            queueName,
            {
                durable: true
            }
        );


        console.log(
            "Waiting for order.confirmed events..."
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
                        "Order confirmed event received:",
                        event
                    );


                    const notification =
                        await Notification.create({
                            userId:
                                event.userId,

                            orderId:
                                event.orderId,

                            type:
                                "ORDER_CONFIRMATION",

                            message:
                                `Your order ${event.orderId} has been confirmed.`,

                            status:
                                "SENT"
                        });


                    console.log(
                        "Notification created:",
                        notification._id.toString()
                    );


                    channel.ack(msg);

                } catch (error) {

                    console.error(
                        "Notification processing failed:",
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