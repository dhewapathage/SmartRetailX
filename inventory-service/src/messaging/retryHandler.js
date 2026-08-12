const RETRY_QUEUE =
    "order.created.retry";

const DLX =
    "smartretailx.dlx";

const DLQ =
    "order.created.dlq";

const EVENTS_EXCHANGE =
    "smartretailx.events";

const MAX_RETRIES = 3;

const RETRY_DELAY_MS = 5000;


const setupRetryInfrastructure =
    async (channel) => {

        // Exchange used to return retry messages
        await channel.assertExchange(
            EVENTS_EXCHANGE,
            "direct",
            {
                durable: true
            }
        );

        // Main order.created queue already exists.
        await channel.assertQueue(
            "order.created",
            {
                durable: true
            }
        );

        // Allow retry queue to send message
        // back to order.created.
        await channel.bindQueue(
            "order.created",
            EVENTS_EXCHANGE,
            "order.created"
        );


        // Dead Letter Exchange
        await channel.assertExchange(
            DLX,
            "direct",
            {
                durable: true
            }
        );


        // Final dead letter queue
        await channel.assertQueue(
            DLQ,
            {
                durable: true
            }
        );


        await channel.bindQueue(
            DLQ,
            DLX,
            "order.created.dlq"
        );


        // Temporary retry queue
        await channel.assertQueue(
            RETRY_QUEUE,
            {
                durable: true,

                messageTtl:
                    RETRY_DELAY_MS,

                deadLetterExchange:
                    EVENTS_EXCHANGE,

                deadLetterRoutingKey:
                    "order.created"
            }
        );


        console.log(
            "Inventory retry/DLQ infrastructure ready"
        );
    };


const handleMessageFailure = (
    channel,
    msg,
    error
) => {

    const headers =
        msg.properties.headers || {};

    const retryCount =
        Number(
            headers["x-retry-count"] || 0
        );


    if (retryCount < MAX_RETRIES) {

        const nextRetry =
            retryCount + 1;

        console.log(
            `Retrying message ${nextRetry}/${MAX_RETRIES}`
        );


        channel.sendToQueue(
            RETRY_QUEUE,
            msg.content,
            {
                persistent: true,

                contentType:
                    "application/json",

                headers: {
                    ...headers,

                    "x-retry-count":
                        nextRetry,

                    "x-last-error":
                        error.message
                }
            }
        );


        // Original message has safely been
        // copied to retry queue.
        channel.ack(msg);

        return;
    }


    console.log(
        "Maximum retries reached. Sending message to DLQ."
    );


    channel.publish(
        DLX,
        "order.created.dlq",
        msg.content,
        {
            persistent: true,

            contentType:
                "application/json",

            headers: {
                ...headers,

                "x-retry-count":
                    retryCount,

                "x-last-error":
                    error.message
            }
        }
    );


    channel.ack(msg);
};


module.exports = {
    setupRetryInfrastructure,
    handleMessageFailure
};