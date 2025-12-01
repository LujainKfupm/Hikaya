// controllers/authController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "الرجاء تعبئة جميع الحقول" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "المستخدم موجود بالفعل" });
        }

        // Create new user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: role || "user",
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "الرجاء إدخال البريد و كلمة المرور" });
        }

        const normalizedEmail = String(email).toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "بيانات الدخول غير صحيحة" });
        }

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
};

export const getMe = async (req, res) => {
    try {
        // protect middleware sets req.user as a user document without password
        if (!req.user) {
            return res.status(401).json({ message: "غير مصرح" });
        }
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

        return res.json(user);
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
};

