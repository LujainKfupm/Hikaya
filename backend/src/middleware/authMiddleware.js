// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "Server misconfiguration" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // attach user (without password) to req.user
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            return next();
        } catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    return res.status(401).json({ message: "Not authorized, no token" });
};

export const optionalAuth = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const token = req.headers.authorization.split(" ")[1];
            if (process.env.JWT_SECRET && token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select("-password");
                if (user) {
                    req.user = user;
                }
            }
        }
        next();
    } catch (err) {
        console.error("optionalAuth error:", err);
        next();
    }
};

export const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admins only" });
    }
    next();
};

