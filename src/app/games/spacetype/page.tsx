import React from "react";
import { SpaceTypeGame } from "@/features/games/spacetype/SpaceTypeGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpaceType | Type100 Games",
  description: "Defend your ship by typing the falling words in this classic space shooter.",
};

export default function SpaceTypePage() {
  return <SpaceTypeGame />;
}
