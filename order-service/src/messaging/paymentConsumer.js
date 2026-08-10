const Order = require("../models/Order");

const {
    publishEvent
} = require("./rabbitmq");


const startPaymentConsumer = async (channel) => {

    const queueName = "payment.completed";

    await channel.assertQueue(
        queueName,
        {
            durable: true
        }
    );

    console.log(
        "Order Service waiting for payment.completed events..."
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
                    "Payment completed event received:",
                    event
                );


                const order = await Order.findById(
                    event.orderId
                );

                if (!order) {

                    console.log(
                        "Order not found"
                    );

                    channel.ack(msg);
                    return;
                }


                order.status = "CONFIRMED";

                await order.save();

                console.log(
                    `Order ${order._id} confirmed`
                );


                await publishEvent(
                    "order.confirmed",
                    {
                        orderId:
                            order._id.toString(),

                        userId:
                            order.userId,

                        paymentId:
                            event.paymentId,

                        totalAmount:
                            order.totalAmount
                    }
                );


                channel.ack(msg);

            } catch (error) {

                console.error(
                    "Failed to process payment.completed:",
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
    startPaymentConsumer
};