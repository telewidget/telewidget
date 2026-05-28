import { useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS, DEFAULT_CHAT_COUNTRY } from "../lib/constants";
import type { FormEvent } from "react";

export type ChatProfile = {
  name: string;
  phone: string;
  countryIso2: string;
};

export function useChatProfile() {
  const [name, setName] = useLocalStorage(STORAGE_KEYS.CHAT_NAME, "");
  const [storedPhone, setStoredPhone] = useLocalStorage(STORAGE_KEYS.CHAT_PHONE, "");
  const [countryIso2, setCountryIso2] = useLocalStorage(STORAGE_KEYS.CHAT_COUNTRY, DEFAULT_CHAT_COUNTRY);

  // Drafts for the editor
  const [draftName, setDraftName] = useState(name);
  const [chatDraftPhone, setChatDraftPhone] = useState(storedPhone);
  const [chatDraftCountryIso2, setChatDraftCountryIso2] = useState(countryIso2);

  // Separate drafts for email form (just reusing same state for now or adding more)
  const [draftEmail, setDraftEmail] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [draftCompany, setDraftCompany] = useState("");

  const { fullPhone } = useMemo(() => {
    return {
      fullPhone: storedPhone
    };
  }, [storedPhone]);

  const hasChatProfile = useMemo(() => {
    return name.trim().length > 0 && storedPhone.trim().length > 0;
  }, [name, storedPhone]);

  const saveChatProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName(draftName);
    setStoredPhone(chatDraftPhone);
    setCountryIso2(chatDraftCountryIso2);
  };

  return {
    // Stored values
    chatName: name,
    chatPhone: fullPhone,
    chatCountryIso2: countryIso2,
    hasChatProfile,

    // Draft values & setters
    draftName, setDraftName,
    draftEmail, setDraftEmail,
    draftMessage, setDraftMessage,
    draftCompany, setDraftCompany,
    chatDraftPhone, setChatDraftPhone,
    chatDraftCountryIso2, setChatDraftCountryIso2,

    saveChatProfile
  };
}
