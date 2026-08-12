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

                        console.log(
                            "Inventory not found"
                        );

                        channel.ack(msg);
                        return;
                    }


                    const reservation =
                        inventory.reservations.find(
                            item =>
                                item.orderId ===
                                event.orderId
                        );


                    // Already released / duplicate release
                    if (!reservation) {

                        console.log(
                            `No reservation found for order ${event.orderId}. Release ignored.`
                        );

                        channel.ack(msg);
                        return;
                    }


                    const releaseQuantity =
                        reservation.quantity;


                    inventory.quantityAvailable +=
                        releaseQuantity;


                    inventory.quantityReserved -=
                        releaseQuantity;


                    inventory.reservations =
                        inventory.reservations.filter(
                            item =>
                                item.orderId !==
                                event.orderId
                        );


                    await inventory.save();


                    console.log(
                        `Released ${releaseQuantity} units for order ${event.orderId}`
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
                        true
                    );
                }
            }
        );
};


module.exports = {
    startReleaseConsumer
};