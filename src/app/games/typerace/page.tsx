import React from "react";
import { TypeRaceGame } from "@/features/games/typerace/TypeRaceGame";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "TypeRace - Multiplayer Typing Game",
  description: "Race against time and other players. Improve your typing speed in a competitive racing environment.",
  canonical: "/games/typerace",
});

export default function TypeRacePage() {
  return <TypeRaceGame />;
}
