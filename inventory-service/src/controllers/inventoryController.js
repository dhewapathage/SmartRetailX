const Inventory = require("../models/Inventory");


const createInventory = async (req, res) => {

    try {

        const {
            productId,
            quantityAvailable
        } = req.body;


        if (
            !productId ||
            quantityAvailable === undefined ||
            Number(quantityAvailable) < 0
        ) {

            return res.status(400).json({
                message:
                    "productId and valid quantityAvailable are required"
            });
        }


        const existing =
            await Inventory.findOne({
                productId
            });


        if (existing) {

            return res.status(400).json({
                message:
                    "Inventory already exists for this product"
            });
        }


        const inventory =
            await Inventory.create({

                productId,

                quantityAvailable:
                    Number(quantityAvailable)
            });


        return res.status(201).json({

            message:
                "Inventory created successfully",

            inventory
        });


    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to create inventory",

            error:
                error.message
        });

    }
};



const getInventory = async (req, res) => {

    try {

        const inventory =
            await Inventory.find();


        return res.status(200).json(
            inventory
        );


    } catch (error) {

        return res.status(500).json({

            message:
                "Failed to retrieve inventory",

            error:
                error.message
        });

    }
};


module.exports = {
    createInventory,
    getInventory
};