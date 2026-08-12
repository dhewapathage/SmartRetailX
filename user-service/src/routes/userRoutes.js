const express = require("express");

const {
    authenticate
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const {
    createUser,
    getUsers,
    getUserById
} = require("../controllers/userController");

const router = express.Router();


/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test Customer
 *               email:
 *                 type: string
 *                 example: customer2@smartretailx.com
 *               password:
 *                 type: string
 *                 example: Test1234
 *               role:
 *                 type: string
 *                 enum:
 *                   - CUSTOMER
 *                   - ADMIN
 *                 example: CUSTOMER
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request or user already exists
 *       500:
 *         description: Failed to create user
 */
router.post(
    "/",
    createUser
);


/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Returns all users. ADMIN access required.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       500:
 *         description: Failed to retrieve users
 */
router.get(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    getUsers
);


/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User MongoDB ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve user
 */
router.get(
    "/:id",
    getUserById
);


module.exports = router;