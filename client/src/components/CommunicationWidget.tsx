import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { 
  X, 
  ChevronLeft, 
  Settings,
  MessageCircle
} from "lucide-react";

import { HomePanel, ChatHistoryPanel } from "./chat/Panels";
import { EmailContactForm } from "./chat/EmailContactForm";
import { LiveChatPanel } from "./chat/LiveChatPanel";

import { useChatProfile } from "../hooks/useChatProfile";
import { useChatHistory } from "../hooks/useChatHistory";
import { useChatSession } from "../hooks/useChatSession";
import { useLocalStorage } from "../hooks/useLocalStorage";

import {
  MAX_ATTACHMENT_BYTES,
  POPUP_DELAY_MS,
  STORAGE_KEYS
} from "../lib/constants";

import type {
  WidgetView,
  SentMessageRecord,
  TeleWidgetConfig
} from "../types";

export default function CommunicationWidget() {
  const config = (window.TeleWidgetConfig || {}) as TeleWidgetConfig;
  
  const [isOpen, setIsOpen] = useState(config._forceOpen || false);
  const [view, setView] = useState<WidgetView>("home");

  const apiBaseUrl = config.apiBaseUrl || "http://localhost:3001";

  const {
    draftName, setDraftName,
    draftEmail, setDraftEmail,
    draftMessage, setDraftMessage,
    draftCompany,
    chatDraftPhone, setChatDraftPhone,
    chatDraftCountryIso2, setChatDraftCountryIso2,
    saveChatProfile,
    hasChatProfile,
    chatName,
    chatPhone,
    chatCountryIso2
  } = useChatProfile();

  const { chatMessages: historyMessages, setChatMessages: setHistoryMessages } = useChatHistory();

  const {
    chatMessages,
    chatNotice,
    isChatSending,
    sendChatMessage,
    setChatNotice
  } = useChatSession(apiBaseUrl);

  const [emailAttachment, setEmailAttachment] = useState<File | null>(null);
  const [chatAttachment, setChatAttachment] = useState<File | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [isChatProfileEditorOpen, setIsChatProfileEditorOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupDismissed, setIsPopupDismissed] = useLocalStorage(STORAGE_KEYS.POPUP_DISMISSED, false);

  const emailAttachmentRef = useRef<HTMLInputElement>(null);
  const chatAttachmentRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state if forceOpen changes
  useEffect(() => {
    if (config._forceOpen !== undefined) {
      setIsOpen(config._forceOpen);
    }
  }, [config._forceOpen]);

  useEffect(() => {
    if (!isPopupDismissed && !isOpen) {
      const timer = setTimeout(() => setShowPopup(true), POPUP_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isPopupDismissed, isOpen]);

  const toggleWidget = useCallback(() => {
    setIsOpen(prev => !prev);
    setShowPopup(false);
    if (!isOpen) setIsPopupDismissed(true);
  }, [isOpen, setIsPopupDismissed]);

  const handleChatClick = useCallback(() => {
    setView("chat");
  }, []);

  const handleHistoryClick = useCallback(() => {
    setView("history");
  }, []);

  const handleBackClick = useCallback(() => {
    setView("home");
  }, []);

  const setValidatedAttachment = useCallback((file: File | null, target: "email" | "chat") => {
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      const msg = { text: "File too large (max 5MB)", tone: "error" as const };
      if (target === "email") setEmailStatus(msg.text);
      else setChatNotice(msg);
      return;
    }
    if (target === "email") setEmailAttachment(file);
    else setChatAttachment(file);
  }, [setChatNotice]);

  const submitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setEmailStatus("");

    try {
      const formData = new FormData();
      formData.append("name", draftName);
      formData.append("email", draftEmail);
      formData.append("message", draftMessage);
      if (emailAttachment) formData.append("attachment", emailAttachment);

      const response = await fetch(`${apiBaseUrl}/api/contact/send`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const record: SentMessageRecord = {
          id: Math.random().toString(36).substring(2, 11),
          name: draftName,
          email: draftEmail,
          message: draftMessage,
          sentAt: new Date().toISOString()
        };
        setHistoryMessages([record, ...historyMessages].slice(0, 10));
        setDraftMessage("");
        setEmailAttachment(null);
        setEmailStatus("Message sent successfully!");
        setTimeout(() => setView("home"), 2000);
      } else {
        setEmailStatus(data.message || "Failed to send message");
      }
    } catch (error) {
      setEmailStatus("Connection error. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const submitLiveChat = async (e?: FormEvent<HTMLFormElement>, customMessage?: string) => {
    if (e) e.preventDefault();
    const msg = customMessage || chatInput;
    if (!msg.trim() && !chatAttachment) return;

    const success = await sendChatMessage(chatName || draftName, chatPhone || chatDraftPhone, msg, chatAttachment);
    if (success) {
      setChatInput("");
      setChatAttachment(null);
      if (chatTextareaRef.current) {
        chatTextareaRef.current.style.height = "auto";
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!hasChatProfile) {
      setChatInput(suggestion);
      setIsChatProfileEditorOpen(true);
    } else {
      submitLiveChat(undefined, suggestion);
    }
  };

  // Dynamic Styles
  const borderRadiusStyle = useMemo(() => {
    switch (config.borderRadius) {
      case "ROUND_FOUR": return "4px";
      case "ROUND_EIGHT": return "8px";
      case "ROUND_TWELVE": return "12px";
      case "ROUND_FULL": return "9999px";
      default: return "24px";
    }
  }, [config.borderRadius]);

  const isDarkMode = config.themeMode === "dark"; // Simple for now

  const panelStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      borderRadius: borderRadiusStyle,
      fontFamily: config.typography?.fontFamily === "Geist Mono" ? "monospace" : "inherit",
    };

    if (config.glassmorphism?.enabled) {
      styles.backdropFilter = `blur(${config.glassmorphism.blur}px)`;
      styles.backgroundColor = isDarkMode
        ? `rgba(15, 15, 15, ${config.glassmorphism.opacity})`
        : `rgba(255, 255, 255, ${config.glassmorphism.opacity})`;
      styles.borderColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
    } else {
      styles.backgroundColor = isDarkMode ? "#0a0a0a" : (config.backgroundColor || "#ffffff");
      styles.borderColor = isDarkMode ? "#222" : "#e2e8f0";
    }

    if (config.effects?.shadow === "glow") {
      styles.boxShadow = `0 0 ${20 * (config.effects.glowIntensity || 0.5)}px ${config.accentColor}`;
    } else if (config.effects?.shadow === "hard") {
      styles.boxShadow = "0 10px 0 rgba(0,0,0,0.1)";
    } else if (config.effects?.shadow === "soft") {
      styles.boxShadow = "0 20px 50px rgba(0,0,0,0.2)";
    }

    return styles;
  }, [config, isDarkMode, borderRadiusStyle]);

  const positionClasses = useMemo(() => {
    const isLeft = config.position === "bottom-left";
    return {
      container: `fixed bottom-6 ${isLeft ? 'left-6' : 'right-6'} z-[9999] flex flex-col ${isLeft ? 'items-start' : 'items-end'}`,
      panel: `${isLeft ? 'origin-bottom-left' : 'origin-bottom-right'}`
    };
  }, [config.position]);

  return (
    <div className={`${positionClasses.container} font-sans text-foreground selection:bg-accent/30`} style={{ '--tw-accent': config.accentColor } as any}>
      {showPopup && !isOpen && (
        <div className={`mb-4 ${config.position === 'bottom-left' ? 'ml-2' : 'mr-2'} max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-500`}>        
          <div className="relative rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-2xl backdrop-blur-md">
            <button onClick={() => { setShowPopup(false); setIsPopupDismissed(true); }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-foreground/10 bg-background text-muted hover:text-foreground transition shadow-sm"><X size={12} /></button>
            <p className="text-sm font-medium leading-relaxed">{config.welcomeMessage || "Hi there! 👋 Have any questions? We're here to help."}</p>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className={`mb-4 flex h-[min(640px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden border shadow-2xl animate-in zoom-in-95 fade-in duration-300 ${positionClasses.panel} ${isDarkMode ? 'dark text-white' : 'text-black'}`}
          style={panelStyles}
        >
          <header 
            className="flex shrink-0 items-center justify-between border-b border-foreground/5 px-6 py-5"
            style={{ backgroundColor: `${config.accentColor}15` }}
          >
            <div className="flex items-center gap-3">
              {view !== "home" && (
                <button onClick={handleBackClick} className="mr-1 rounded-full p-1 text-muted hover:bg-foreground/5 hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><ChevronLeft size={20} /></button>
              )}
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  {view === "home" ? (config.title || "Support Desk") : view === "email" ? "Email Us" : view === "chat" ? "Live Chat" : "History"}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted/80">Active now</span>
                </div>
              </div>
            </div>
            {view === "chat" && hasChatProfile && (
              <button onClick={() => setIsChatProfileEditorOpen(true)} className="rounded-full p-2 text-muted hover:bg-foreground/5 hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" title="Chat settings"><Settings size={18} /></button>
            )}
          </header>

          <main className="flex min-h-0 flex-1 flex-col p-6">
            {view === "home" && <HomePanel onChatClick={handleChatClick} onHistoryClick={handleHistoryClick} />}
            {view === "email" && (
              <EmailContactForm
                draftName={draftName} setDraftName={setDraftName}
                draftEmail={draftEmail} setDraftEmail={setDraftEmail}
                draftMessage={draftMessage} setDraftMessage={setDraftMessage}
                draftCompany={draftCompany}
                emailAttachment={emailAttachment} setEmailAttachment={setValidatedAttachment}
                emailAttachmentRef={emailAttachmentRef as any}
                isSending={isSendingEmail}
                status={emailStatus}
                submitMessage={submitEmail}
              />
            )}
            {view === "chat" && (
              <LiveChatPanel
                hasChatProfile={hasChatProfile}
                chatName={chatName}
                chatPhone={chatPhone}
                chatCountryIso2={chatCountryIso2}
                chatMessages={chatMessages}
                chatNotice={chatNotice}
                isChatProfileEditorOpen={isChatProfileEditorOpen}
                setIsChatProfileEditorOpen={setIsChatProfileEditorOpen}
                draftName={draftName} setDraftName={setDraftName}
                chatDraftPhone={chatDraftPhone} setChatDraftPhone={setChatDraftPhone}
                chatDraftCountryIso2={chatDraftCountryIso2} setChatDraftCountryIso2={setChatDraftCountryIso2}   
                phoneInputRef={phoneInputRef as any}
                saveChatProfile={(e) => { saveChatProfile(e); setIsChatProfileEditorOpen(false); }}
                isEmojiPickerOpen={isEmojiPickerOpen} setIsEmojiPickerOpen={setIsEmojiPickerOpen}
                chatAttachment={chatAttachment} setValidatedAttachment={setValidatedAttachment}
                chatAttachmentRef={chatAttachmentRef as any}
                chatInput={chatInput} setChatInput={setChatInput}
                chatTextareaRef={chatTextareaRef as any}
                isChatSending={isChatSending}
                submitLiveChat={submitLiveChat}
                handleSuggestionClick={handleSuggestionClick}
              />
            )}
            {view === "history" && (
              <ChatHistoryPanel
                messageHistory={historyMessages}
                onStartConversation={() => setView("home")}
                onReuseMessage={(record) => {
                  setDraftMessage(record.message);
                  setView("email");
                }}
              />
            )}
          </main>
        </div>
      )}

      <button
        onClick={toggleWidget}
        aria-label={isOpen ? "Close support widget" : "Open support widget"}
        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/50"
        style={{ 
            backgroundColor: config.accentColor || '#00ff88',
            boxShadow: config.effects?.shadow === 'glow' ? `0 0 20px ${config.accentColor}80` : undefined
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" />}
      </button>
    </div>
  );
}
