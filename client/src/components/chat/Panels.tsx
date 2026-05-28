import { History, Mail, Phone, Send } from "lucide-react";
import { CONTACT_EMAIL, PHONE_URL, WHATSAPP_URL } from "../../lib/constants";
import type { SentMessageRecord } from "../../types";
import { formatSentAt } from "../../lib/chat-utils";
import { memo } from "react";

import { WhatsAppIcon } from "../WhatsAppIcon";
import { VisuallyHidden } from "../VisuallyHidden";
import { ScrollArea } from "../ScrollArea";

export const HomePanel = memo(function HomePanel({
  onChatClick,
  onHistoryClick
}: {
  onChatClick: () => void;
  onHistoryClick: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center">
      <ScrollArea className="max-h-full pr-2">
        <div className="flex flex-col space-y-8 pb-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Response channel</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">Choose the fastest way to reach the support desk.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={onChatClick} className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] py-4 text-sm font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Send size={18} /> Chat</button> 
            <a href={PHONE_URL} className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] py-4 text-sm font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Phone size={18} /> Call</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] py-4 text-sm font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Mail size={18} /> Email</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] py-4 text-sm font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><WhatsAppIcon className="h-4 w-4" /> WhatsApp <VisuallyHidden>(opens in a new tab)</VisuallyHidden></a>
            <button onClick={onHistoryClick} className="flex items-center justify-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] py-4 text-sm font-bold transition hover:border-accent/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><History size={18} /> History</button>
          </div>
          <p className="text-center text-[10px] text-muted">Email messages go to {CONTACT_EMAIL}.</p>
        </div>
      </ScrollArea>
    </div>
  );
});

const HistoryMessageItem = memo(function HistoryMessageItem({ record, onReuse }: { record: SentMessageRecord, onReuse: (record: SentMessageRecord) => void }) {
  return (
    <article className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 shadow-sm">
      <div className="flex justify-between text-xs text-muted mb-2">
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{record.name}</span>
          <span className="text-[10px] opacity-60">{record.email}</span>
        </div>
        <span>{formatSentAt(record.sentAt)}</span>
      </div>
      <p className="text-sm line-clamp-3 text-muted">{record.message}</p>
      <button aria-label={`Reuse message sent at ${formatSentAt(record.sentAt)}`} onClick={() => onReuse(record)} className="mt-3 flex items-center gap-1 rounded-sm text-xs font-bold text-accent transition hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Send size={12} /> Use again</button>
    </article>
  );
});

export const ChatHistoryPanel = memo(function ChatHistoryPanel({
  messageHistory,
  onStartConversation,
  onReuseMessage
}: {
  messageHistory: SentMessageRecord[];
  onStartConversation: () => void;
  onReuseMessage: (record: SentMessageRecord) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col space-y-4 overflow-hidden">
      <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent">Message history</p>       
      {messageHistory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pb-8 text-center">
          <History className="h-10 w-10 text-muted/30 mb-4" />
          <p className="text-sm text-foreground font-bold mb-1">No messages yet</p>
          <p className="text-xs text-muted mb-6">Your past conversations will appear here.</p>
          <button
            onClick={onStartConversation}
            className="text-xs font-bold bg-accent text-black px-5 py-2.5 rounded-full hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start a conversation
          </button>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1 pr-2">
          <div className="space-y-3 pb-4">
            {messageHistory.map(record => (
              <HistoryMessageItem key={record.id} record={record} onReuse={onReuseMessage} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
});
