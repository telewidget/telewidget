const EMOJI_OPTIONS = [
  "😀", "😃", "😂", "🙂", "😊", "😇", "🤔", "👍",
  "🙏", "🤝", "🔥", "✅", "⚙️", "🔧", "💡", "🚀",
  "📁", "🛠️", "🔌", "🤖", "📦", "📎", "📞", "✉️",
  "❤️", "⭐", "⚡", "🎯", "📋", "🧪", "📊", "💬",
];

interface EmojiPickerElementProps {
  onEmojiClick: (detail: { unicode: string }) => void;
  theme?: "light" | "dark";
}

import { ScrollArea } from "../ScrollArea";

export default function EmojiPickerElement({ onEmojiClick }: EmojiPickerElementProps) {
  return (
    <ScrollArea
      aria-label="Emoji picker"
      className="max-h-[min(240px,calc(100dvh-2rem))] bg-background p-2"
    >
      <div className="grid grid-cols-8 gap-0.5">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          aria-label={`Add emoji ${emoji}`}
          onClick={() => onEmojiClick({ unicode: emoji })}
          className="flex aspect-square items-center justify-center rounded-lg text-xl transition hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {emoji}
        </button>
      ))}
      </div>
    </ScrollArea>
  );
}
