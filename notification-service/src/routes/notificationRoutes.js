const express = require("express");

const {
    authenticate
} = require("../middleware/authMiddleware");

const {
    getNotifications
} = require("../controllers/notificationController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/notifications:
 *   get:
 *     summary: Get notifications for the authenticated user
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Failed to retrieve notifications
 */
router.get(
    "/",
    authenticate,
    getNotifications
);


module.exports = router;