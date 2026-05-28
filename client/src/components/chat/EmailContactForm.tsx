import type { FormEvent, RefObject, ChangeEvent } from "react";
import { Loader2, Paperclip, Send } from "lucide-react";
import { buildEmailFallbackHref } from "../../lib/chat-utils";
import { CONTACT_EMAIL } from "../../lib/constants";

import { AttachmentPreview } from "./AttachmentPreview";
import { Tooltip } from "../Tooltip";
import { ScrollArea } from "../ScrollArea";

interface EmailContactFormProps {
  draftName: string;
  setDraftName: (val: string) => void;
  draftEmail: string;
  setDraftEmail: (val: string) => void;
  draftMessage: string;
  setDraftMessage: (val: string) => void;
  draftCompany: string;
  emailAttachment: File | null;
  setEmailAttachment: (file: File | null, target: "email" | "chat") => void;
  emailAttachmentRef: RefObject<HTMLInputElement>;
  isSending: boolean;
  status: string;
  submitMessage: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function EmailContactForm({
  draftName,
  setDraftName,
  draftEmail,
  setDraftEmail,
  draftMessage,
  setDraftMessage,
  draftCompany,
  emailAttachment,
  setEmailAttachment,
  emailAttachmentRef,
  isSending,
  status,
  submitMessage,
}: EmailContactFormProps) {
  return (
    <form onSubmit={submitMessage} className="flex flex-1 h-full min-h-0 flex-col justify-between">
      <ScrollArea className="h-full min-h-0 flex-1 pr-2">
        <div className="flex min-h-full flex-col space-y-4 pb-2">
          <input
            required
            aria-label="Name"
            maxLength={80}
            value={draftName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDraftName(e.currentTarget.value)}
            className="w-full rounded-lg border border-foreground/15 bg-transparent px-4 py-3 text-sm focus:border-accent outline-none transition"
            placeholder="* Name"
          />
          <input
            required
            aria-label="Email"
            type="email"
            maxLength={120}
            value={draftEmail}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDraftEmail(e.currentTarget.value)}
            className="w-full rounded-lg border border-foreground/15 bg-transparent px-4 py-3 text-sm focus:border-accent outline-none transition"
            placeholder="* Email"
          />
          <textarea
            required
            aria-label="Message"
            maxLength={4000}
            value={draftMessage}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDraftMessage(e.currentTarget.value)}
            className="min-h-[160px] flex-1 w-full rounded-lg border border-foreground/15 bg-transparent px-4 py-3 text-sm focus:border-accent outline-none transition"
            placeholder="* Message"
          />
          {emailAttachment && (
            <AttachmentPreview
              file={emailAttachment}
              onRemove={() => setEmailAttachment(null, "email")}
            />
          )}
          <input
            ref={emailAttachmentRef}
            aria-label="Email attachment"
            type="file"
            className="hidden"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmailAttachment(e.currentTarget.files?.[0] ?? null, "email")
            }
          />
        </div>
      </ScrollArea>
      <div className="mt-auto pt-4 shrink-0 flex flex-col">
        <div className="flex gap-2">
          <Tooltip content="Attach file">
            <button
              type="button"
              aria-label="Attach file"
              onClick={() => emailAttachmentRef.current?.click()}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-foreground/15 hover:bg-accent/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Paperclip size={18} />
            </button>
          </Tooltip>
          <button
            type="submit"
            disabled={isSending}
            aria-label="Send message"
            className="flex-1 rounded-lg bg-accent text-black font-bold flex items-center justify-center gap-2 hover:bg-accent-hover transition disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />}{" "}
            {isSending ? "Sending..." : "Send message"}
          </button>
        </div>
        <a
          aria-label="Open email app with this message"
          href={buildEmailFallbackHref(
            draftName,
            draftEmail,
            draftMessage,
            CONTACT_EMAIL,
            draftCompany
          )}
          className="block text-center mt-2 text-[10px] text-muted hover:text-accent transition rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Or open in your email app
        </a>
        {status && (
          <p aria-live="polite" className="text-center text-xs text-muted pt-1">
            {status}
          </p>
        )}
      </div>
    </form>
  );
}
