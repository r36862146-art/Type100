import React from "react";
import { KeyTowerGame } from "@/features/games/keytower/KeyTowerGame";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "KeyTower - Typing Game",
  description: "Build the highest tower by typing letters perfectly. A game of focus, rhythm, and precision.",
  canonical: "/games/keytower",
});

export default function KeyTowerPage() {
  return <KeyTowerGame />;
}
