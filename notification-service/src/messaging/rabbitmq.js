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


const connectRabbitMQ = async () => {

    const connection =
        await amqp.connect(
            getRabbitMQUrl()
        );

    const channel =
        await connection.createChannel();


    console.log(
        "Notification Service connected to RabbitMQ"
    );

    return channel;
};


module.exports = {
    connectRabbitMQ
};

