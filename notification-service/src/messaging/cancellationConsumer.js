const Notification =
    require("../models/Notification");


const startCancellationConsumer =
    async (channel) => {

        const queueName =
            "order.cancelled";


        await channel.assertQueue(
            queueName,
            {
                durable: true
            }
        );


        console.log(
            "Waiting for order.cancelled events..."
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


                    await Notification.create({
                        userId:
                            event.userId,

                        orderId:
                            event.orderId,

                        type:
                            "ORDER_CANCELLATION",

                        message:
                            `Your order ${event.orderId} was cancelled. Reason: ${event.reason}`,

                        status:
                            "SENT"
                    });


                    console.log(
                        "Order cancellation notification created"
                    );


                    channel.ack(msg);

                } catch (error) {

                    console.error(
                        "Cancellation notification failed:",
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
    startCancellationConsumer
};