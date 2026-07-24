import React from "react";
import { SpaceTypeGame } from "@/features/games/spacetype/SpaceTypeGame";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "SpaceType - Typing Game",
  description: "Defend your ship by typing the words attached to incoming asteroids. An intense typing game for speed and accuracy.",
  canonical: "/games/spacetype",
});

export default function SpaceTypePage() {
  return <SpaceTypeGame />;
}
