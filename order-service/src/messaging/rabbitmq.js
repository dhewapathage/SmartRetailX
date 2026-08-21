const amqp = require("amqplib");

const getRabbitMQUrl = () => {
    // Local Docker / development
    if (process.env.RABBITMQ_URL) {
        return process.env.RABBITMQ_URL;
    }
    // AWS Amazon MQ
    const {
        RABBITMQ_ENDPOINT,
        RABBITMQ_USERNAME,
        RABBITMQ_PASSWORD
    } = process.env;
    if (
        !RABBITMQ_ENDPOINT ||
        !RABBITMQ_USERNAME ||
        !RABBITMQ_PASSWORD
    ) {
        throw new Error(
            "RabbitMQ configuration is incomplete"
        );
    }
    const url =
        new URL(RABBITMQ_ENDPOINT);
    url.username =
        RABBITMQ_USERNAME;
    url.password =
        RABBITMQ_PASSWORD;
    return url.toString();
};

let channel;


const connectRabbitMQ = async () => {

    const connection = await amqp.connect(
        getRabbitMQUrl()
    );

    channel = await connection.createChannel();

    console.log(
        "Order Service connected to RabbitMQ"
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


const publishOrderCreated = async (
    event
) => {

    await publishEvent(
        "order.created",
        event
    );
};


module.exports = {
    connectRabbitMQ,
    publishEvent,
    publishOrderCreated
};

