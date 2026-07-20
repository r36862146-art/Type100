import React from "react";
import { cn } from "@/lib/utils";

interface CursorProps {
  className?: string;
}

export const Cursor = React.memo(({ className }: CursorProps) => {
  return (
    <span
      // The cursor sits on the left edge of the current character.
      // We use a simple pulse animation for the blinking effect.
      className={cn(
        "absolute -left-[1px] top-[10%] h-[80%] w-[2px] rounded-full bg-primary animate-pulse transition-all",
        className
      )}
      aria-hidden="true"
    />
  );
});
Cursor.displayName = "Cursor";
