import React from "react";
import { WordTetrisGame } from "@/features/games/wordtetris/WordTetrisGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Tetris | Type100 Games",
  description: "Survive as long as possible by typing the falling words before they reach the bottom.",
};

export default function WordTetrisPage() {
  return <WordTetrisGame />;
}
