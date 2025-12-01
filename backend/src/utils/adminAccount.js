import User from "../models/User.js";
import bcrypt from "bcryptjs";


export async function AdminAccount() {
    try {
        const email = "admin@hikaya.com";
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) return;

        const admin = new User({
            name: "مشرف",
            email,
            password: "admin123",
            role: "admin"
        });

        await admin.save();

        console.log("Admin account created successfully");
    } catch (err) {
        console.error("Failed to seed admin:", err);
    }
}

