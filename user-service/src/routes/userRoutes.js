const express = require("express");
const { authenticate } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const {
    createUser,
    getUsers,
    getUserById
} = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);

router.get(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    getUsers
);

router.get("/:id", getUserById);

module.exports = router;