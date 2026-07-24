import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CursorProps {
  className?: string;
}

export const Cursor = React.memo(({ className }: CursorProps) => {
  return (
    <motion.span
      layoutId="caret"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0, 1] }}
      transition={{
        opacity: { repeat: Infinity, duration: 1, ease: "easeInOut" },
        layout: { type: "spring", stiffness: 1000, damping: 60 },
      }}
      className={cn(
        "absolute -left-[1px] top-[10%] h-[80%] w-[3px] rounded-full bg-primary z-10",
        className
      )}
      aria-hidden="true"
    />
  );
});
Cursor.displayName = "Cursor";
