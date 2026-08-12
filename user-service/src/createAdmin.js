require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");


const createAdmin = async () => {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "Connected to MongoDB"
        );


        const email =
            "admin@smartretailx.com";

        const password =
            "Admin1234";


        const existingAdmin =
            await User.findOne({
                email: email
            });


        if (existingAdmin) {

            console.log(
                "Admin account already exists:",
                existingAdmin.email
            );

            await mongoose.connection.close();

            return;
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const admin =
            await User.create({

                name:
                    "SmartRetailX Admin",

                email:
                    email,

                password:
                    hashedPassword,

                role:
                    "ADMIN"
            });


        console.log(
            "Admin created successfully"
        );

        console.log(
            "Email:",
            admin.email
        );

        console.log(
            "Role:",
            admin.role
        );


        await mongoose.connection.close();


    } catch (error) {

        console.error(
            "Failed to create admin:",
            error.message
        );

        await mongoose.connection.close();
    }
};


createAdmin();