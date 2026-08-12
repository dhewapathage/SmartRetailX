const Notification =
    require("../models/Notification");


const getNotifications = async (req, res) => {

    try {

        const userId =
            req.user.userId;

        const notifications =
            await Notification.find({
                userId: userId
            }).sort({
                createdAt: -1
            });

        res.status(200).json(
            notifications
        );

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to retrieve notifications",

            error:
                error.message
        });
    }
};


module.exports = {
    getNotifications
};