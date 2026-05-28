export interface TeleWidgetConfig {
  id?: string;
  name?: string;
  updatedAt?: string;

  // Design
  accentColor?: string;
  backgroundColor?: string;
  borderRadius?: "ROUND_FOUR" | "ROUND_EIGHT" | "ROUND_TWELVE" | "ROUND_FULL";
  position?: "bottom-right" | "bottom-left";

  // Advanced Design
  themeMode?: "light" | "dark" | "system";
  glassmorphism?: {
    enabled: boolean;
    opacity: number;
    blur: number;
  };
  effects?: {
    shadow: "none" | "soft" | "hard" | "glow";
    glowIntensity: number;
  };
  typography?: {
    fontFamily: "Geist Sans" | "Geist Mono" | "Inter" | "System";
  };

  // Content
  title?: string;
  welcomeMessage?: string;

  // Channels
  channels?: {
    whatsapp?: {
      enabled: boolean;
      phone: string;
      label: string;
    };
    phone?: {
      enabled: boolean;
      number: string;
      label: string;
    };
    email?: {
      enabled: boolean;
      address: string;
      label: string;
    };
    telegram?: {
      enabled: boolean;
      botToken: string;
      label: string;
    };
  };

  // API
  apiBaseUrl?: string;
  containerId?: string;

  // Internal flags
  _forceOpen?: boolean;
}

export type WidgetView = "home" | "email" | "chat" | "history";
export type MessageMode = "chat" | "email";

export interface SentMessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  sentAt: string;
}

export interface LiveChatMessage {
  id: string;
  sessionId: string;
  direction: "visitor" | "admin";
  body: string;
  createdAt: string;
}

export interface ChatNotice {
  text: string;
  tone: "error" | "info";
}

declare global {
  interface Window {
    TeleWidget: {
      init: (config: TeleWidgetConfig) => void;
    };
    TeleWidgetConfig?: TeleWidgetConfig;
  }
}
