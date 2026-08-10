const Inventory =
    require("../models/Inventory");


const startReleaseConsumer =
    async (channel) => {

        const queueName =
            "inventory.release";


        await channel.assertQueue(
            queueName,
            {
                durable: true
            }
        );


        console.log(
            "Waiting for inventory.release events..."
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
                        "Inventory release received:",
                        event
                    );


                    const inventory =
                        await Inventory.findOne({
                            productId:
                                event.productId
                        });


                    if (!inventory) {

                        channel.ack(msg);
                        return;
                    }


                    const releaseQuantity =
                        Math.min(
                            event.quantity,
                            inventory.quantityReserved
                        );


                    inventory.quantityReserved -=
                        releaseQuantity;


                    inventory.quantityAvailable +=
                        releaseQuantity;


                    await inventory.save();


                    console.log(
                        `Released ${releaseQuantity} units back to inventory`
                    );


                    channel.ack(msg);

                } catch (error) {

                    console.error(
                        "Inventory release failed:",
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
    startReleaseConsumer
};