import React from "react";
import { KeyTowerGame } from "@/features/games/keytower/KeyTowerGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "KeyTower | Type100 Games",
  description: "Build the tallest tower possible by typing words accurately.",
};

export default function KeyTowerPage() {
  return <KeyTowerGame />;
}
