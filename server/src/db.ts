import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "chat.db");
const db = new Database(dbPath);

export const CHAT_SCHEMA_STATEMENTS = [
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

export function ensureChatSchema() {
  for (const statement of CHAT_SCHEMA_STATEMENTS) {
    db.prepare(statement).run();
  }
}

export function upsertSession(sessionId: string, name: string, phone: string) {
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

export function getSession(sessionId: string) {
  return db.prepare(`
    SELECT
      session_id as sessionId,
      name,
      phone,
      telegram_thread_id as telegramThreadId,
      telegram_topic_name as telegramTopicName
    FROM chat_sessions
    WHERE session_id = ?
  `).get(sessionId) as any;
}

export function getSessionByThread(telegramThreadId: number) {
  return db.prepare(`
    SELECT
      session_id as sessionId,
      name,
      phone,
      telegram_thread_id as telegramThreadId,
      telegram_topic_name as telegramTopicName
    FROM chat_sessions
    WHERE telegram_thread_id = ?
  `).get(telegramThreadId) as any;
}

export function updateSessionThread(sessionId: string, telegramThreadId: number, telegramTopicName: string) {
  db.prepare(`
    UPDATE chat_sessions
    SET telegram_thread_id = ?, telegram_topic_name = ?, updated_at = ?
    WHERE session_id = ?
  `).run(telegramThreadId, telegramTopicName, new Date().toISOString(), sessionId);
}

export function insertMessage(sessionId: string, direction: 'visitor' | 'admin', body: string, telegramMessageId?: number) {
  const id = Math.random().toString(36).substring(2, 15);
  const createdAt = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO chat_messages (id, session_id, direction, body, telegram_message_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, sessionId, direction, body, telegramMessageId ?? null, createdAt);

  return { id, sessionId, direction, body, createdAt };
}

export function listMessages(sessionId: string) {
  return db.prepare(`
    SELECT id, session_id as sessionId, direction, body, created_at as createdAt
    FROM chat_messages
    WHERE session_id = ?
    ORDER BY created_at ASC
    LIMIT 100
  `).all(sessionId) as any[];
}
