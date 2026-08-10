const Payment =
    require("../models/Payment");

const {
    publishEvent
} = require("./rabbitmq");


const startInventoryConsumer =
    async (channel) => {

        const queueName =
            "inventory.reserved";

        await channel.assertQueue(
            queueName,
            {
                durable: true
            }
        );

        console.log(
            "Waiting for inventory.reserved events..."
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
                        "Inventory reserved event received:",
                        event
                    );


                    const existingPayment =
                        await Payment.findOne({
                            orderId:
                                event.orderId
                        });

                    if (existingPayment) {

                        console.log(
                            "Payment already processed"
                        );

                        channel.ack(msg);
                        return;
                    }


                    const payment =
                        await Payment.create({
                            orderId:
                                event.orderId,

                            userId:
                                event.userId,

                            amount:
                                event.totalAmount,

                            status:
                                "COMPLETED"
                        });


                    console.log(
                        "Payment completed:",
                        payment._id.toString()
                    );


                    await publishEvent(
                        "payment.completed",
                        {
                            paymentId:
                                payment._id.toString(),

                            orderId:
                                event.orderId,

                            userId:
                                event.userId,

                            amount:
                                event.totalAmount
                        }
                    );


                    channel.ack(msg);

                } catch (error) {

                    console.error(
                        "Payment processing failed:",
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
    startInventoryConsumer
};