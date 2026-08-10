const amqp = require("amqplib");


const connectRabbitMQ = async () => {

    const connection =
        await amqp.connect(
            process.env.RABBITMQ_URL
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