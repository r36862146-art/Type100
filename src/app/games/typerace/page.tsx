import React from "react";
import { TypeRaceGame } from "@/features/games/typerace/TypeRaceGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Type Race | Type100 Games",
  description: "Race against opponents by typing as fast and accurately as possible.",
};

export default function TypeRacePage() {
  return <TypeRaceGame />;
}
