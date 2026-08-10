const Payment = require("../models/Payment");

const {
    publishEvent
} = require("./rabbitmq");


const startInventoryConsumer = async (channel) => {

    const queueName = "inventory.reserved";

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

                const event = JSON.parse(
                    msg.content.toString()
                );

                console.log(
                    "Inventory reserved event received:",
                    event
                );


                const existingPayment =
                    await Payment.findOne({
                        orderId: event.orderId
                    });

                if (existingPayment) {

                    console.log(
                        "Payment already processed"
                    );

                    channel.ack(msg);
                    return;
                }


                // TEST-ONLY payment failure simulation
                const paymentFailed =
                    event.simulatePaymentFailure === true;


                const payment =
                    await Payment.create({
                        orderId: event.orderId,
                        userId: event.userId,
                        amount: event.totalAmount,
                        status:
                            paymentFailed
                                ? "FAILED"
                                : "COMPLETED"
                    });


                if (paymentFailed) {

                    console.log(
                        "Payment failed (simulated)"
                    );

                    await publishEvent(
                        "payment.failed",
                        {
                            paymentId:
                                payment._id.toString(),

                            orderId:
                                event.orderId,

                            userId:
                                event.userId,

                            productId:
                                event.productId,

                            quantity:
                                event.quantity,

                            amount:
                                event.totalAmount,

                            reason:
                                "Simulated payment failure"
                        }
                    );

                } else {

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
                }


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