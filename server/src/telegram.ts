import fetch from "node-fetch";

export function buildTelegramTopicName(name: string, phone: string) {
  const base = `${name || "Visitor"} - ${phone || "no phone"}`
    .replace(/\s+/g, " ")
    .trim();
  return base.length > 128 ? base.slice(0, 125).trimEnd() + "..." : base;
}

export function buildTelegramVisitorMessage(name: string, phone: string, message: string) {
  return [
    `New website chat`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    "",
    message || "Attachment sent.",
  ].join("\n");
}

async function callTelegram<T>(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === "mock_dev_token") {
    console.log(`[Telegram Mock] ${method}:`, JSON.stringify(payload, null, 2));
    if (method === "createForumTopic") {
      return { ok: true, result: { message_thread_id: Math.floor(Math.random() * 1000000) } } as unknown as T;
    }
    return { ok: true, result: { message_id: Math.floor(Math.random() * 1000000) } } as unknown as T;
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as any;
  if (!response.ok || result.ok === false) {
    throw new Error(result.description || `Telegram ${method} failed.`);
  }
  return result as T;
}

export async function createTelegramTopic(name: string, phone: string) {
  const topicName = buildTelegramTopicName(name, phone);
  const result = await callTelegram<any>("createForumTopic", {
    chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
    name: topicName,
  });
  return { threadId: result.result.message_thread_id, topicName };
}

export async function sendTelegramMessage(threadId: number, text: string) {
  const result = await callTelegram<any>("sendMessage", {
    chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
    message_thread_id: threadId,
    text,
  });
  return result.result.message_id;
}

export async function sendTelegramDocument(threadId: number, file: Express.Multer.File, caption: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || token === "mock_dev_token") {
    console.log(`[Telegram Mock] sendDocument:`, caption, `(File: ${file.originalname})`);
    return Math.floor(Math.random() * 1000000);
  }

  const { FormData } = await import("formdata-node");
  const { fileFromPath } = await import("formdata-node/file-from-path");

  const formData = new FormData();
  formData.append("chat_id", process.env.TELEGRAM_ADMIN_CHAT_ID!);
  formData.append("message_thread_id", String(threadId));
  formData.append("caption", caption.slice(0, 1024));
  formData.append("document", await fileFromPath(file.path), file.originalname);

  const response = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
    method: "POST",
    body: formData as any,
  });

  const result = (await response.json()) as any;
  if (!response.ok || result.ok === false) {
    throw new Error(result.description || "Telegram sendDocument failed.");
  }
  return result.result.message_id;
}
