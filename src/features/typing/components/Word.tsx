import React from "react";
import { Word as WordType } from "../types";
import { Character } from "./Character";
import { cn } from "@/lib/utils";

interface WordProps {
  word: WordType;
  className?: string;
}

export const Word = React.memo(({ word, className }: WordProps) => {
  return (
    // inline-block ensures the entire word moves to the next line together if it wraps.
    <span className={cn("inline-block", className)}>
      {word.characters.map((char) => (
        <Character key={char.id} char={char} />
      ))}
    </span>
  );
});
Word.displayName = "Word";
