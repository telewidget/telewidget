"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAT_SCHEMA_STATEMENTS = void 0;
exports.ensureChatSchema = ensureChatSchema;
exports.upsertSession = upsertSession;
exports.getSession = getSession;
exports.getSessionByThread = getSessionByThread;
exports.updateSessionThread = updateSessionThread;
exports.insertMessage = insertMessage;
exports.listMessages = listMessages;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = require("path");
const dbPath = (0, path_1.join)(process.cwd(), "chat.db");
const db = new better_sqlite3_1.default(dbPath);
exports.CHAT_SCHEMA_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    telegram_thread_id INTEGER,
    telegram_topic_name TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
    `CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('visitor', 'admin')),
    body TEXT NOT NULL,
    telegram_message_id INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
  )`,
    `CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created
    ON chat_messages(session_id, created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_chat_sessions_thread
    ON chat_sessions(telegram_thread_id)`,
];
function ensureChatSchema() {
    for (const statement of exports.CHAT_SCHEMA_STATEMENTS) {
        db.prepare(statement).run();
    }
}
function upsertSession(sessionId, name, phone) {
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO chat_sessions (session_id, name, phone, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      name = excluded.name,
      phone = excluded.phone,
      updated_at = excluded.updated_at
  `).run(sessionId, name, phone, now, now);
}
function getSession(sessionId) {
    return db.prepare(`
    SELECT
      session_id as sessionId,
      name,
      phone,
      telegram_thread_id as telegramThreadId,
      telegram_topic_name as telegramTopicName
    FROM chat_sessions
    WHERE session_id = ?
  `).get(sessionId);
}
function getSessionByThread(telegramThreadId) {
    return db.prepare(`
    SELECT
      session_id as sessionId,
      name,
      phone,
      telegram_thread_id as telegramThreadId,
      telegram_topic_name as telegramTopicName
    FROM chat_sessions
    WHERE telegram_thread_id = ?
  `).get(telegramThreadId);
}
function updateSessionThread(sessionId, telegramThreadId, telegramTopicName) {
    db.prepare(`
    UPDATE chat_sessions
    SET telegram_thread_id = ?, telegram_topic_name = ?, updated_at = ?
    WHERE session_id = ?
  `).run(telegramThreadId, telegramTopicName, new Date().toISOString(), sessionId);
}
function insertMessage(sessionId, direction, body, telegramMessageId) {
    const id = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date().toISOString();
    db.prepare(`
    INSERT INTO chat_messages (id, session_id, direction, body, telegram_message_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, sessionId, direction, body, telegramMessageId ?? null, createdAt);
    return { id, sessionId, direction, body, createdAt };
}
function listMessages(sessionId) {
    return db.prepare(`
    SELECT id, session_id as sessionId, direction, body, created_at as createdAt
    FROM chat_messages
    WHERE session_id = ?
    ORDER BY created_at ASC
    LIMIT 100
  `).all(sessionId);
}
//# sourceMappingURL=db.js.map