require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { getMongoConnection } = require("./config/database");
const createAdmin = async () => {
    try {
        await mongoose.connect(
            ...getMongoConnection("smartretailx")
        );
        console.log("Connected to database");
        const email =
            process.env.ADMIN_EMAIL ||
            "admin@smartretailx.com";
        const password =
            process.env.ADMIN_PASSWORD;
        if (!password) {
            throw new Error(
                "ADMIN_PASSWORD environment variable is required"
            );
        }
        const existingAdmin =
            await User.findOne({ email });
        if (existingAdmin) {
            console.log(
                "Admin account already exists:",
                existingAdmin.email
            );
            await mongoose.connection.close();
            return;
        }
        const hashedPassword =
            await bcrypt.hash(password, 10);
        const admin =
            await User.create({
                name: "SmartRetailX Admin",
                email,
                password: hashedPassword,
                role: "ADMIN"
            });
        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
        await mongoose.connection.close();
    } catch (error) {
        console.error(
            "Failed to create admin:",
            error.message
        );
        await mongoose.connection.close();
        process.exitCode = 1;
    }
};
createAdmin();
