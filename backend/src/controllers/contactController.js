import Message from "../models/Message.js";

export const deleteMessage = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "غير مصرح" });
        }

        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "الرسالة غير موجودة" });
        }

        await message.deleteOne();
        res.json({ message: "تم حذف الرسالة بنجاح" });
    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({ message: "حدث خطأ في الخادم" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message)
            return res.status(400).json({ message: "All fields required" });

        const msg = await Message.create({ name, email, message });
        res.status(201).json(msg);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};