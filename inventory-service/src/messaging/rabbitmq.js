const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {

    const connection = await amqp.connect(
        process.env.RABBITMQ_URL
    );

    channel = await connection.createChannel();

    console.log(
        "Inventory Service connected to RabbitMQ"
    );

    return channel;
};


const publishEvent = async (
    queueName,
    event
) => {

    if (!channel) {
        throw new Error(
            "RabbitMQ channel is not ready"
        );
    }

    await channel.assertQueue(
        queueName,
        {
            durable: true
        }
    );

    channel.sendToQueue(
        queueName,
        Buffer.from(
            JSON.stringify(event)
        ),
        {
            persistent: true
        }
    );

    console.log(
        `${queueName} event published:`,
        event
    );
};


module.exports = {
    connectRabbitMQ,
    publishEvent
};