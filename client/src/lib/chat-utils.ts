import { COUNTRY_DIAL_OPTIONS, DEFAULT_CHAT_COUNTRY } from "./constants";

export function getCountryOption(iso2: string) {
  const normalizedIso2 = iso2.trim().toUpperCase();
  return (
    COUNTRY_DIAL_OPTIONS.find((country) => country.iso2 === normalizedIso2) ??
    COUNTRY_DIAL_OPTIONS.find((c) => c.iso2 === DEFAULT_CHAT_COUNTRY) ??
    COUNTRY_DIAL_OPTIONS[0]
  );
}

export function formatChatPhone(countryIso2: string, phone: string) {
  const cleanPhone = phone.trim();
  if (!cleanPhone) {
    return "";
  }

  if (cleanPhone.startsWith("+")) {
    return cleanPhone.replace(/[^\d+().\-\s]/g, "");
  }

  const dialCode = getCountryOption(countryIso2).dialCode;
  return `${dialCode}${cleanPhone.replace(/[^\d().\-\s]/g, "")}`;
}

const SORTED_COUNTRY_DIAL_OPTIONS = [...COUNTRY_DIAL_OPTIONS].sort(
  (first, second) => second.dialCode.length - first.dialCode.length,
);

export function inferPhoneParts(
  storedPhone: string,
  storedCountryIso2?: string | null,
) {
  const cleanPhone = storedPhone.trim();
  const noSpacePhone = cleanPhone.replace(/\s/g, "");

  const country =
    (storedCountryIso2 &&
      COUNTRY_DIAL_OPTIONS.find(
        (option) => option.iso2 === storedCountryIso2.toUpperCase(),
      )) ||
    SORTED_COUNTRY_DIAL_OPTIONS.find((option) =>
      noSpacePhone.startsWith(option.dialCode),
    ) ||
    getCountryOption(DEFAULT_CHAT_COUNTRY);

  const phone = noSpacePhone.startsWith(country.dialCode)
    ? noSpacePhone.slice(country.dialCode.length)
    : cleanPhone;

  return { countryIso2: country.iso2, phone };
}

export function generateSecureFallback(prefix = ""): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const randomHex = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${prefix}${Date.now()}${randomHex}`;
  }
  return `${prefix}${Date.now()}${Math.random().toString(36).substring(2)}`;
}

export function createLocalId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : generateSecureFallback("loc-");
}

export function getOrCreateChatSessionId() {
  try {
    if (typeof window === "undefined") return "";

    const key = "telewidget.chatSessionId";
    const existingSessionId = window.localStorage.getItem(key);

    if (existingSessionId && /^[a-zA-Z0-9_-]{16,80}$/.test(existingSessionId)) {
      return existingSessionId;
    }

    const nextSessionId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "")
        : generateSecureFallback();

    window.localStorage.setItem(key, nextSessionId);
    return nextSessionId;
  } catch {
    try {
      return generateSecureFallback();
    } catch {
      return "";
    }
  }
}

export function parseCloudflareTraceCountry(traceText: string) {
  const country = traceText.match(/^loc=([A-Z]{2})$/m)?.[1];
  return country &&
    COUNTRY_DIAL_OPTIONS.some((option) => option.iso2 === country)
    ? country
    : "";
}

const sentAtFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatSentAt(sentAt: string) {
  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) {
    return "Sent date unavailable";
  }
  return sentAtFormatter.format(date);
}

const chatTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatChatTime(sentAt: string) {
  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return chatTimeFormatter.format(date);
}

export function buildEmailFallbackHref(
  name: string,
  email: string,
  message: string,
  contactEmail: string,
  company?: string,
) {
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();
  const cleanCompany = company?.trim();
  const subject = cleanName
    ? `Project inquiry from ${cleanName}`
    : "Project inquiry";
  const body = [
    "New project inquiry",
    "",
    `Name: ${cleanName || "-"}`,
    `Email: ${cleanEmail || "-"}`,
    `Company: ${cleanCompany || "-"}`,
    "",
    "Message:",
    cleanMessage || "-",
  ].join("\n");

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;      
}

export function buildWhatsAppDraftHref(
  name: string,
  phone: string,
  message: string,
  whatsappUrl: string,
) {
  const body = [
    `Name: ${name.trim() || "-"}`,
    `Phone: ${phone.trim() || "-"}`,
    "",
    message.trim() || "-",
  ].join("\n");
  return `${whatsappUrl}?text=${encodeURIComponent(body)}`;
}

export function formatAttachmentSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
