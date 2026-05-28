import type { SentMessageRecord } from "../types";
import { STORAGE_KEYS } from "../lib/constants";
import { useLocalStorage } from "./useLocalStorage";

export function useChatHistory() {
  const [chatMessages, setChatMessages] = useLocalStorage<SentMessageRecord[]>(
    STORAGE_KEYS.MESSAGE_HISTORY,
    []
  );

  return {
    chatMessages,
    setChatMessages,
  };
}
