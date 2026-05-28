"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTelegramTopicName = buildTelegramTopicName;
exports.buildTelegramVisitorMessage = buildTelegramVisitorMessage;
exports.createTelegramTopic = createTelegramTopic;
exports.sendTelegramMessage = sendTelegramMessage;
exports.sendTelegramDocument = sendTelegramDocument;
const node_fetch_1 = __importDefault(require("node-fetch"));
function buildTelegramTopicName(name, phone) {
    const base = `${name || "Visitor"} - ${phone || "no phone"}`
        .replace(/\s+/g, " ")
        .trim();
    return base.length > 128 ? base.slice(0, 125).trimEnd() + "..." : base;
}
function buildTelegramVisitorMessage(name, phone, message) {
    return [
        `New website chat`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        "",
        message || "Attachment sent.",
    ].join("\n");
}
async function callTelegram(method, payload) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token === "mock_dev_token") {
        console.log(`[Telegram Mock] ${method}:`, JSON.stringify(payload, null, 2));
        if (method === "createForumTopic") {
            return { ok: true, result: { message_thread_id: Math.floor(Math.random() * 1000000) } };
        }
        return { ok: true, result: { message_id: Math.floor(Math.random() * 1000000) } };
    }
    const response = await (0, node_fetch_1.default)(`https://api.telegram.org/bot${token}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const result = (await response.json());
    if (!response.ok || result.ok === false) {
        throw new Error(result.description || `Telegram ${method} failed.`);
    }
    return result;
}
async function createTelegramTopic(name, phone) {
    const topicName = buildTelegramTopicName(name, phone);
    const result = await callTelegram("createForumTopic", {
        chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
        name: topicName,
    });
    return { threadId: result.result.message_thread_id, topicName };
}
async function sendTelegramMessage(threadId, text) {
    const result = await callTelegram("sendMessage", {
        chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
        message_thread_id: threadId,
        text,
    });
    return result.result.message_id;
}
async function sendTelegramDocument(threadId, file, caption) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token === "mock_dev_token") {
        console.log(`[Telegram Mock] sendDocument:`, caption, `(File: ${file.originalname})`);
        return Math.floor(Math.random() * 1000000);
    }
    const { FormData } = await import("formdata-node");
    const { fileFromPath } = await import("formdata-node/file-from-path");
    const formData = new FormData();
    formData.append("chat_id", process.env.TELEGRAM_ADMIN_CHAT_ID);
    formData.append("message_thread_id", String(threadId));
    formData.append("caption", caption.slice(0, 1024));
    formData.append("document", await fileFromPath(file.path), file.originalname);
    const response = await (0, node_fetch_1.default)(`https://api.telegram.org/bot${token}/sendDocument`, {
        method: "POST",
        body: formData,
    });
    const result = (await response.json());
    if (!response.ok || result.ok === false) {
        throw new Error(result.description || "Telegram sendDocument failed.");
    }
    return result.result.message_id;
}
//# sourceMappingURL=telegram.js.map