import { useEffect, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { Tooltip } from "../Tooltip";

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

export function AttachmentPreview({ file, onRemove }: AttachmentPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div className="relative mb-3 mt-1 flex items-center gap-3 rounded-xl border border-foreground/15 bg-background p-2 pr-10 shadow-sm transition-colors hover:border-accent/50 dark:bg-foreground/5">
      {previewUrl ? (
        file.type.startsWith("video/") ? (
          <video
            src={previewUrl}
            className="h-10 w-10 shrink-0 rounded-lg object-cover bg-black/10 dark:bg-white/10"
          />
        ) : (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/10 dark:bg-white/10"> 
            <img
              src={previewUrl}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          </div>
        )
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-muted">
          <Paperclip size={18} />
        </div>
      )}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <span className="truncate text-xs font-bold text-foreground">
          {file.name}
        </span>
        <span className="text-[10px] text-muted">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>
      <Tooltip content="Remove attachment">
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-foreground/10 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Remove attachment"
        >
          <X size={14} />
        </button>
      </Tooltip>
    </div>
  );
}
