import React from "react";
import { Character as CharacterType } from "../types";
import { cn } from "@/lib/utils";
import { Cursor } from "./Cursor";

interface CharacterProps {
  char: CharacterType;
}

export const Character = React.memo(({ char }: CharacterProps) => {
  const { value, state } = char;
  
  // Tailwind classes based on the validation state
  let stateClasses = "";
  switch (state) {
    case "idle":
      stateClasses = "text-muted-foreground/60";
      break;
    case "current":
      stateClasses = "text-foreground";
      break;
    case "correct":
      stateClasses = "text-primary";
      break;
    case "incorrect":
      // For spaces that are typed incorrectly, we need a background color 
      // since the text color won't be visible.
      stateClasses = value === " " ? "bg-destructive/30" : "text-destructive";
      break;
    case "extra":
      stateClasses = "text-destructive/70";
      break;
    case "missed":
      stateClasses = "text-muted-foreground/60 border-b-2 border-destructive";
      break;
  }

  return (
    <span 
      className={cn(
        "relative font-mono text-2xl sm:text-3xl transition-colors duration-100", 
        stateClasses,
        value === " " && "whitespace-pre" // ensure space characters preserve their width
      )}
      aria-hidden="true" // Screen readers will read the whole text, not character by character
    >
      {state === "current" && <Cursor />}
      {value}
    </span>
  );
});
Character.displayName = "Character";
