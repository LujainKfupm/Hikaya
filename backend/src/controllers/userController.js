import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } }).select("-password");
        return res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent deleting admin accounts
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });

        if (user.role === "admin") {
            return res.status(403).json({ message: "لا يمكن حذف حساب المشرف" });
        }

        await User.findByIdAndDelete(userId);

        return res.json({ message: "تم حذف المستخدم بنجاح" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم" });
    }
};
