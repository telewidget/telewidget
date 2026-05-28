import express from "express";
import cors from "cors";
import multer from "multer";
import { config } from "dotenv";
import { 
  ensureChatSchema, 
  upsertSession, 
  getSession, 
  updateSessionThread, 
  insertMessage, 
  listMessages,
  getSessionByThread
} from "./db.js";
import { 
  createTelegramTopic, 
  sendTelegramMessage, 
  sendTelegramDocument,
  buildTelegramVisitorMessage
} from "./telegram.js";
import { unlink } from "fs/promises";

console.log("Starting server...");
config();
console.log("Config loaded.");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

ensureChatSchema();

app.get("/api/chat/history", async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string;
    if (!sessionId) return res.status(400).json({ success: false, message: "Missing sessionId" });
    
    const messages = listMessages(sessionId);
    res.json({ success: true, messages });
  } catch (error) {
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

    upsertSession(sessionId, name, phone);
    let session = getSession(sessionId);

    let threadId = session.telegramThreadId;
    if (!threadId) {
      const topic = await createTelegramTopic(name, phone);
      updateSessionThread(sessionId, topic.threadId, topic.topicName);
      threadId = topic.threadId;
    }

    const visitorMessage = buildTelegramVisitorMessage(name, phone, message);
    let telegramMessageId;

    if (req.file) {
      telegramMessageId = await sendTelegramDocument(threadId, req.file, visitorMessage);
    } else {
      telegramMessageId = await sendTelegramMessage(threadId, visitorMessage);
    }

    const storedMessage = req.file 
      ? [message, `Attachment: ${req.file.originalname}`].filter(Boolean).join("\n\n")
      : message;

    insertMessage(sessionId, "visitor", storedMessage, telegramMessageId);
    const messages = listMessages(sessionId);

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  } finally {
    if (attachmentPath) {
      await unlink(attachmentPath).catch(() => {});
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

    const session = getSessionByThread(message.message_thread_id);
    if (session) {
      insertMessage(session.sessionId, "admin", message.text, message.message_id);
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.json({ ok: true });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
