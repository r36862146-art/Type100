import React from "react";
import { useTypingStore } from "../store";

export function LiveTimer() {
  const config = useTypingStore((state) => state.config);
  
  // By selecting only the calculated total seconds, Zustand will only trigger 
  // a re-render when the seconds value actually changes (once per second).
  const totalSeconds = useTypingStore((state) => {
    if (config.mode === "time" && config.timeLimit) {
      return Math.ceil(state.stats.remainingTime / 1000);
    }
    return Math.floor(state.stats.elapsedTime / 1000);
  });
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex justify-center items-center w-full my-6 text-2xl font-mono text-primary font-semibold tracking-wider">
      {formattedTime}
    </div>
  );
}
