const bcrypt = require("bcryptjs");
const User = require("../models/User");


const createUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }


        const existingUser =
            await User.findOne({
                email: email.toLowerCase()
            });


        if (existingUser) {

            return res.status(400).json({
                message:
                    "User already exists"
            });
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await User.create({

                name,

                email:
                    email.toLowerCase(),

                password:
                    hashedPassword,

                // Public registration can only
                // create customers
                role:
                    "CUSTOMER"
            });


        res.status(201).json({

            message:
                "User registered successfully",

            user: {
                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role
            }
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to create user",

            error:
                error.message
        });
    }
};


const getUsers = async (req, res) => {

    try {

        const users =
            await User.find().select(
                "-password"
            );

        res.status(200).json(
            users
        );

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to retrieve users",

            error:
                error.message
        });
    }
};


const getUserById = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            ).select("-password");


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found"
            });
        }


        res.status(200).json(
            user
        );


    } catch (error) {

        res.status(500).json({
            message:
                "Failed to retrieve user",

            error:
                error.message
        });
    }
};


module.exports = {
    createUser,
    getUsers,
    getUserById
};