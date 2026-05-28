import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { 
    viewportRef?: React.Ref<HTMLDivElement>; 
    onScroll?: React.UIEventHandler<HTMLDivElement> 
  }
>(({ className, children, viewportRef, onScroll, type = "scroll", scrollHideDelay = 1500, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    type={type}
    scrollHideDelay={scrollHideDelay}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      ref={viewportRef}
      onScroll={onScroll}
      className="h-full w-full rounded-[inherit]"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none opacity-0 transition-[opacity,background-color] duration-200 data-[state=visible]:opacity-100",
      orientation === "vertical" &&
        "h-full w-2 border-l border-l-transparent p-[2px]",
      orientation === "horizontal" &&
        "h-2 flex-col border-t border-t-transparent p-[2px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-foreground/20 transition-colors hover:bg-accent/70 dark:bg-white/20 dark:hover:bg-accent/70" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
