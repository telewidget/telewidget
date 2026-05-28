import type { 
  SentMessageRecord, 
  LiveChatMessage, 
  ChatNotice,
  WidgetView,
  MessageMode
} from "../types";

export const CONTACT_EMAIL = "contact@electrotion.com";
export const CONTACT_PHONE = "+94707540052";
export const WHATSAPP_URL = "https://wa.me/94707540052";
export const PHONE_URL = `tel:${CONTACT_PHONE}`;

export const STORAGE_KEYS = {
  CONTACT_PROFILE: "telewidget.contactProfile",
  CHAT_NAME: "telewidget.chatName",
  CHAT_PHONE: "telewidget.chatPhone",
  CHAT_COUNTRY: "telewidget.chatCountry",
  MESSAGE_HISTORY: "telewidget.messageHistory",
  CHAT_SESSION_ID: "telewidget.chatSessionId",
  POPUP_DISMISSED: "telewidget.chatPopupDismissed",
} as const;

export const DEFAULT_CHAT_COUNTRY = "LK";

export type CountryDialOption = {
  iso2: string;
  name: string;
  dialCode: string;
};

export const COUNTRY_DIAL_OPTIONS: CountryDialOption[] = [
  { iso2: "AU", name: "Australia", dialCode: "+61" },
  { iso2: "BD", name: "Bangladesh", dialCode: "+880" },
  { iso2: "BR", name: "Brazil", dialCode: "+55" },
  { iso2: "CA", name: "Canada", dialCode: "+1" },
  { iso2: "CN", name: "China", dialCode: "+86" },
  { iso2: "FR", name: "France", dialCode: "+33" },
  { iso2: "DE", name: "Germany", dialCode: "+49" },
  { iso2: "IN", name: "India", dialCode: "+91" },
  { iso2: "ID", name: "Indonesia", dialCode: "+62" },
  { iso2: "IT", name: "Italy", dialCode: "+39" },
  { iso2: "JP", name: "Japan", dialCode: "+81" },
  { iso2: "MY", name: "Malaysia", dialCode: "+60" },
  { iso2: "MX", name: "Mexico", dialCode: "+52" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31" },
  { iso2: "NO", name: "Norway", dialCode: "+47" },
  { iso2: "PK", name: "Pakistan", dialCode: "+92" },
  { iso2: "PH", name: "Philippines", dialCode: "+63" },
  { iso2: "SG", name: "Singapore", dialCode: "+65" },
  { iso2: "ZA", name: "South Africa", dialCode: "+27" },
  { iso2: "KR", name: "South Korea", dialCode: "+82" },
  { iso2: "LK", name: "Sri Lanka", dialCode: "+94" },
  { iso2: "SE", name: "Sweden", dialCode: "+46" },
  { iso2: "TH", name: "Thailand", dialCode: "+66" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44" },
  { iso2: "US", name: "United States", dialCode: "+1" },
];

export const CHAT_SUGGESTIONS = [
  "Do you provide custom automation solutions?",
  "Can you help with PCB design and prototyping?",
  "I have a new product idea, can we discuss it?",
  "How do I request a quote for a project?",
];

export const MESSAGE_HISTORY_LIMIT = 10;
export const CHAT_POLL_INTERVAL_MS = 5000;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const POPUP_DELAY_MS = 8000;

export type { SentMessageRecord, LiveChatMessage, ChatNotice, WidgetView, MessageMode };

export type MessageDraft = {
  name: string;
  email: string;
  message: string;
  company: string;
};

export type StoredContactProfile = Pick<MessageDraft, "name" | "email">;
