import { memo, useRef, useEffect } from "react";
import type { FormEvent, RefObject, ChangeEvent } from "react";
import { Loader2, Paperclip, Send, Smile } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Toast, ToastDescription, ToastProvider, ToastViewport } from "../Toast";
import { ScrollArea } from "../ScrollArea";
import { CHAT_SUGGESTIONS } from "../../lib/constants";
import type { ChatNotice, LiveChatMessage } from "../../types";
import { formatChatTime } from "../../lib/chat-utils";
import { AttachmentPreview } from "./AttachmentPreview";
import EmojiPickerElement from "./EmojiPickerElement";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const ChatMessageItem = memo(function ChatMessageItem({ msg }: { msg: LiveChatMessage }) {
  let text = msg.body || "";
  let attachmentName = null;

  const attachmentPrefix = "Attachment: ";
  const separator = "\n\n" + attachmentPrefix;

  if (text.includes(separator)) {
    const parts = text.split(separator);
    attachmentName = parts.pop();
    text = parts.join(separator);
  } else if (text.startsWith(attachmentPrefix)) {
    attachmentName = text.substring(attachmentPrefix.length);
    text = "";
  }

  return (
    <div className={`flex ${msg.direction === "visitor" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] break-words rounded-2xl px-4 py-2 text-sm ${msg.direction === "visitor" ? "bg-accent text-black rounded-br-md" : "bg-foreground/10 text-foreground rounded-bl-md"}`}>
        {text && <p className="whitespace-pre-wrap">{text}</p>}
        {attachmentName && (
          <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 ${msg.direction === "visitor" ? "bg-black/10" : "bg-black/5 dark:bg-white/10"}`}>
            <Paperclip size={14} className="shrink-0" />
            <span className="truncate text-xs font-bold">{attachmentName}</span>
          </div>
        )}
        <span className="text-[10px] opacity-60 block mt-1 text-right">{formatChatTime(msg.createdAt)}</span>   
      </div>
    </div>
  );
});

interface LiveChatPanelProps {
  hasChatProfile: boolean;
  chatName: string;
  chatPhone: string;
  chatCountryIso2: string;
  chatMessages: LiveChatMessage[];
  chatNotice: ChatNotice | null;

  isChatProfileEditorOpen: boolean;
  setIsChatProfileEditorOpen: (val: boolean) => void;

  draftName: string;
  setDraftName: (val: string) => void;

  chatDraftPhone: string;
  setChatDraftPhone: (val: string) => void;

  chatDraftCountryIso2: string;
  setChatDraftCountryIso2: (val: string) => void;

  phoneInputRef: RefObject<HTMLInputElement>;
  saveChatProfile: (e: FormEvent<HTMLFormElement>) => void;

  isEmojiPickerOpen: boolean;
  setIsEmojiPickerOpen: (val: boolean) => void;

  chatAttachment: File | null;
  setValidatedAttachment: (file: File | null, target: "email" | "chat") => void;
  chatAttachmentRef: RefObject<HTMLInputElement>;

  chatInput: string;
  setChatInput: (val: string | ((prev: string) => string)) => void;
  chatTextareaRef: RefObject<HTMLTextAreaElement>;

  isChatSending: boolean;
  submitLiveChat: (e?: FormEvent<HTMLFormElement>, customMessage?: string) => void;
  handleSuggestionClick: (suggestion: string) => void;
}

export function LiveChatPanel({
  hasChatProfile,
  chatMessages,
  chatNotice,
  isChatProfileEditorOpen,
  setIsChatProfileEditorOpen,
  draftName,
  setDraftName,
  chatDraftPhone,
  setChatDraftPhone,
  chatDraftCountryIso2,
  setChatDraftCountryIso2,
  phoneInputRef,
  saveChatProfile,
  isEmojiPickerOpen,
  setIsEmojiPickerOpen,
  chatAttachment,
  setValidatedAttachment,
  chatAttachmentRef,
  chatInput,
  setChatInput,
  chatTextareaRef,
  isChatSending,
  submitLiveChat,
  handleSuggestionClick
}: LiveChatPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    isAtBottomRef.current = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
  };

  useEffect(() => {
    if (isAtBottomRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {!hasChatProfile && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 shadow-sm dark:bg-white/[0.03]">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-foreground">Profile required</p>
            <p className="mt-0.5 truncate text-[10px] text-muted">Add details to start</p>
          </div>
          <button aria-label="Add details" onClick={() => setIsChatProfileEditorOpen(true)} className="shrink-0 rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Add details</button>     
        </div>
      )}
      <ScrollArea
        viewportRef={scrollContainerRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 rounded-xl border border-foreground/10 bg-foreground/[0.025] dark:bg-white/[0.025]"
      >
        <div className="min-h-full space-y-3 p-3">
          {chatMessages.map(msg => (
            <ChatMessageItem key={msg.id} msg={msg} />
          ))}
          {chatMessages.length === 0 && hasChatProfile && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[85%] break-words rounded-2xl rounded-tl-sm bg-foreground/10 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm dark:bg-white/10">
                <p>Hey, welcome! 👋 Thanks for visiting.</p>
                <p className="mt-1">Can I help you with anything today?</p>
                <span className="text-[10px] opacity-60 block mt-1 text-right">Just now</span>
              </div>
            </div>
          )}
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-end gap-2.5 pt-1">
              {CHAT_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="max-w-[88%] break-words rounded-2xl rounded-tr-sm border border-accent/15 bg-accent/10 px-4 py-2.5 text-left text-sm font-medium leading-snug text-accent shadow-sm transition hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <ToastProvider swipeDirection="right">
            <Toast open={!!chatNotice} duration={3000} className="w-auto p-3 pr-4 rounded-xl border border-foreground/10 bg-background/95 backdrop-blur-md shadow-2xl">
              <ToastDescription className={chatNotice?.tone === "error" ? "text-red-500 font-medium text-sm" : "text-foreground text-sm"}>
                {chatNotice?.text}
              </ToastDescription>
            </Toast>
            <ToastViewport className="absolute bottom-20 left-4 right-4 z-[100] flex flex-col p-0 m-0 outline-none" />
          </ToastProvider>
        </div>
      </ScrollArea>
      {isChatProfileEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat details"
          className="absolute inset-0 z-20 flex min-h-0 flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background/95 p-3 shadow-2xl backdrop-blur-md dark:bg-[#0d1111]/95 sm:p-5"
        >
          <form onSubmit={saveChatProfile} className="flex min-h-0 flex-1 flex-col gap-4">
            <ScrollArea className="min-h-0 flex-1 pr-1">
              <div className="flex flex-col justify-center min-h-full space-y-4 pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">Chat details</p>
                <p className="mt-1 text-xs text-muted">Used only to reply to your project chat.</p>
              </div>
              <input required aria-label="Chat name" maxLength={80} value={draftName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDraftName(e.currentTarget.value)} className="w-full rounded-lg border border-foreground/15 bg-foreground/[0.02] px-4 py-3 text-sm outline-none transition focus:border-accent dark:bg-white/[0.03]" placeholder="* Name" />
              <div className="flex gap-2 relative">
                <PhoneInput
                  defaultCountry={chatDraftCountryIso2.toLowerCase()}
                  value={chatDraftPhone}
                  forceDialCode
                  onChange={(phone, meta) => {
                    setChatDraftPhone(phone);
                    if (meta.country?.iso2) {
                      setChatDraftCountryIso2(meta.country.iso2.toUpperCase());
                    }
                  }}
                  inputRef={phoneInputRef as any}
                  required
                  className="w-full react-international-phone-theme flex gap-2"
                  inputClassName="w-full flex-1 rounded-lg border border-foreground/15 bg-transparent px-4 py-3 text-sm focus:border-accent outline-none text-foreground"
                  inputProps={{
                    "aria-label": "Chat phone",
                  }}
                  countrySelectorStyleProps={{
                    buttonClassName: "border border-foreground/15 bg-foreground/[0.02] dark:bg-white/[0.03] rounded-lg px-3 py-2 text-sm font-bold flex items-center justify-center text-foreground hover:bg-foreground/5 transition h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    dropdownStyleProps: {
                      className: "bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-y-auto max-h-[min(12.5rem,var(--radix-popover-content-available-height),calc(100dvh-2rem))] text-foreground p-1",    
                    }
                  }}
                  style={{
                    "--react-international-phone-height": "46px",
                    "--react-international-phone-background-color": "transparent",
                    "--react-international-phone-text-color": "var(--foreground)",
                    "--react-international-phone-border-color": "var(--glass-border, rgba(255,255,255,0.15))",  
                    "--react-international-phone-border-radius": "8px",
                    "--react-international-phone-dropdown-item-background-color": "var(--background)",
                    "--react-international-phone-dropdown-item-text-color": "var(--foreground)",
                    "--react-international-phone-selected-dropdown-item-background-color": "var(--accent)",     
                    "--react-international-phone-selected-dropdown-item-text-color": "#000000",
                  } as any}
                />
              </div>
              </div>
            </ScrollArea>
            <div className="flex shrink-0 gap-2">
              {hasChatProfile && <button type="button" onClick={() => setIsChatProfileEditorOpen(false)} className="flex-1 border border-foreground/10 rounded-lg py-2 font-bold transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Cancel</button>}
              <button aria-label="Save details" type="submit" className="flex-1 bg-accent text-black rounded-lg py-2 font-bold transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">Save</button>
            </div>
          </form>
        </div>
      )}

      <form onSubmit={(e) => submitLiveChat(e)} className="relative mt-1 shrink-0 flex flex-col">
        <input ref={chatAttachmentRef} aria-label="Chat attachment" type="file" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => setValidatedAttachment(e.currentTarget.files?.[0] ?? null, "chat")} />
        {chatAttachment && (
          <AttachmentPreview
            file={chatAttachment}
            onRemove={() => setValidatedAttachment(null, "chat")}
          />
        )}
        <div className="flex items-end gap-1.5 rounded-xl border border-foreground/15 bg-background p-2 shadow-sm transition focus-within:border-accent dark:bg-[#080a0a]">
          <button type="button" onClick={() => chatAttachmentRef.current?.click()} className="rounded-md p-2 text-muted transition hover:bg-foreground/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Attach file to chat" title="Attach file to chat"><Paperclip size={18} /></button>
          <textarea required={!chatAttachment} aria-label="Chat message" maxLength={2000} ref={chatTextareaRef} rows={1} value={chatInput} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setChatInput(e.currentTarget.value)} className="max-h-28 min-h-9 flex-1 resize-none border-none bg-transparent p-2 text-sm leading-5 outline-none placeholder:text-muted/80" placeholder="Type message..." />
          <Popover.Root open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
            <Popover.Trigger asChild>
              <button aria-label="Open emoji picker" title="Open emoji picker" type="button" className="rounded-md p-2 text-muted transition hover:bg-foreground/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Smile size={18} /></button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="top"
                align="end"
                sideOffset={10}
                collisionPadding={12}
                className="z-[120] max-h-[min(16rem,var(--radix-popover-content-available-height),calc(100dvh-2rem))] w-[min(260px,calc(100vw-2rem))] outline-none bg-background border border-foreground/10 rounded-xl shadow-2xl overflow-hidden"
              >
                <EmojiPickerElement
                  onEmojiClick={e => {
                    setChatInput(prev => prev + e.unicode);
                    setIsEmojiPickerOpen(false);
                    requestAnimationFrame(() => chatTextareaRef.current?.focus());
                  }}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
          <button aria-label="Send chat message" title="Send chat message" type="submit" disabled={isChatSending || (!chatInput.trim() && !chatAttachment)} className="rounded-md p-2 text-accent transition hover:bg-accent/10 disabled:text-muted disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">{isChatSending ? <Loader2 className="animate-spin" /> : <Send size={18} />}</button>
        </div>
      </form>
    </div>
  );
}
