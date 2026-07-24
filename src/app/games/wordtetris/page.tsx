import React from "react";
import { WordTetrisGame } from "@/features/games/wordtetris/WordTetrisGame";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Word Tetris - Typing Game",
  description: "Type the falling words before they hit the ground! A fast-paced typing game to improve your reflexes.",
  canonical: "/games/wordtetris",
});

export default function WordTetrisPage() {
  return <WordTetrisGame />;
}
