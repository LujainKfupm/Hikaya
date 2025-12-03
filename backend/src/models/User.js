
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "الاسم مطلوب"],
        minlength: [2, "الاسم يجب أن يكون أطول من حرفين"]
    },

    email: {
        type: String,
        required: [true, "البريد الإلكتروني مطلوب"],
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "صيغة البريد الإلكتروني غير صحيحة"
        ]
    },

    password: {
        type: String,
        required: [true, "كلمة المرور مطلوبة"],
        minlength: [6, "كلمة المرور يجب أن تكون ستّة أحرف على الأقل"]
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });


// Hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model("User", userSchema);
