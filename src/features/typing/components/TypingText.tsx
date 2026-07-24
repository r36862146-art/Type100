import React from "react";
import { Word as WordType } from "../types";
import { Word } from "./Word";

interface TypingTextProps {
  words: WordType[];
}

export const TypingText = React.memo(({ words }: TypingTextProps) => {
  return (
    <div 
      className="w-full text-left leading-[2.5] select-none break-words flex flex-wrap content-start"
      aria-hidden="true" // Hidden from screen readers to prevent them from reading individual characters loudly
    >
      {words.map((word) => (
        <Word key={word.id} word={word} />
      ))}
    </div>
  );
});
TypingText.displayName = "TypingText";
