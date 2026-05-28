"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = require("dotenv");
const db_1 = require("./db");
const telegram_1 = require("./telegram");
const promises_1 = require("fs/promises");
console.log("Starting server...");
(0, dotenv_1.config)();
console.log("Config loaded.");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ dest: "uploads/" });
(0, db_1.ensureChatSchema)();
app.get("/api/chat/history", async (req, res) => {
    try {
        const sessionId = req.query.sessionId;
        if (!sessionId)
            return res.status(400).json({ success: false, message: "Missing sessionId" });
        const messages = (0, db_1.listMessages)(sessionId);
        res.json({ success: true, messages });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
app.post("/api/chat/send", upload.single("attachment"), async (req, res) => {
    let attachmentPath = req.file?.path;
    try {
        const { sessionId, name, phone, message } = req.body;
        if (!sessionId || !name || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        (0, db_1.upsertSession)(sessionId, name, phone);
        let session = (0, db_1.getSession)(sessionId);
        let threadId = session.telegramThreadId;
        if (!threadId) {
            const topic = await (0, telegram_1.createTelegramTopic)(name, phone);
            (0, db_1.updateSessionThread)(sessionId, topic.threadId, topic.topicName);
            threadId = topic.threadId;
        }
        const visitorMessage = (0, telegram_1.buildTelegramVisitorMessage)(name, phone, message);
        let telegramMessageId;
        if (req.file) {
            telegramMessageId = await (0, telegram_1.sendTelegramDocument)(threadId, req.file, visitorMessage);
        }
        else {
            telegramMessageId = await (0, telegram_1.sendTelegramMessage)(threadId, visitorMessage);
        }
        const storedMessage = req.file
            ? [message, `Attachment: ${req.file.originalname}`].filter(Boolean).join("\n\n")
            : message;
        (0, db_1.insertMessage)(sessionId, "visitor", storedMessage, telegramMessageId);
        const messages = (0, db_1.listMessages)(sessionId);
        res.json({ success: true, messages });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
    finally {
        if (attachmentPath) {
            await (0, promises_1.unlink)(attachmentPath).catch(() => { });
        }
    }
});
// Telegram Webhook
app.post("/api/telegram/webhook", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.text || !message.message_thread_id) {
            return res.json({ ok: true });
        }
        const session = (0, db_1.getSessionByThread)(message.message_thread_id);
        if (session) {
            (0, db_1.insertMessage)(session.sessionId, "admin", message.text, message.message_id);
        }
        res.json({ ok: true });
    }
    catch (error) {
        console.error(error);
        res.json({ ok: true });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map