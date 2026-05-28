import { useState, useCallback, useEffect, useRef } from "react";
import type { LiveChatMessage, ChatNotice } from "../types";
import { 
  STORAGE_KEYS, 
  CHAT_POLL_INTERVAL_MS, 
  MAX_ATTACHMENT_BYTES 
} from "../lib/constants";
import { useLocalStorage } from "./useLocalStorage";

export function useChatSession(apiBaseUrl: string) {
  const [sessionId, setSessionId] = useLocalStorage<string>(
    STORAGE_KEYS.CHAT_SESSION_ID,
    ""
  );
  
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([]);
  const [chatNotice, setChatNotice] = useState<ChatNotice | null>(null);
  const [isChatSending, setIsChatSending] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initSession = useCallback(() => {
    if (!sessionId) {
      const newId = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
      setSessionId(newId);
      return newId;
    }
    return sessionId;
  }, [sessionId, setSessionId]);

  const fetchHistory = useCallback(async (sid: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat/history?sessionId=${sid}`);
      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    if (sessionId) {
      fetchHistory(sessionId);
      pollTimerRef.current = setInterval(() => fetchHistory(sessionId), CHAT_POLL_INTERVAL_MS);
    }
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [sessionId, fetchHistory]);

  const sendChatMessage = useCallback(async (
    name: string,
    phone: string,
    message: string,
    attachment: File | null
  ) => {
    const sid = initSession();
    setIsChatSending(true);
    setChatNotice(null);

    try {
      if (attachment && attachment.size > MAX_ATTACHMENT_BYTES) {
        throw new Error("Attachment must be 5 MB or smaller.");
      }

      const formData = new FormData();
      formData.append("sessionId", sid);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("message", message);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await fetch(`${apiBaseUrl}/api/chat/send`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setChatMessages(data.messages);
        return true;
      } else {
        setChatNotice({ text: data.message || "Failed to send message", tone: "error" });
        return false;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Connection error";
      setChatNotice({ text: msg, tone: "error" });
      return false;
    } finally {
      setIsChatSending(false);
    }
  }, [apiBaseUrl, initSession]);

  return {
    sessionId,
    chatMessages,
    chatNotice,
    isChatSending,
    sendChatMessage,
    fetchHistory,
    setChatNotice
  };
}
