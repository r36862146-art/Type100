import { useEffect, useRef } from "react";
import { useTypingStore } from "../store";

/**
 * Hook to drive the timer for the typing engine.
 * It listens to the session status and ticks the store's timer continuously
 * while the session is running.
 */
export function useTypingTimer() {
  const status = useTypingStore((state) => state.status);
  const tick = useTypingStore((state) => state.tick);
  const lastTickRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "running") {
      lastTickRef.current = performance.now();

      const loop = (timestamp: number) => {
        if (lastTickRef.current !== null) {
          const deltaTime = timestamp - lastTickRef.current;
          tick(deltaTime);
        }
        lastTickRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      animationFrameRef.current = requestAnimationFrame(loop);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // If status is idle or finished, clean up any running frames
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTickRef.current = null;
    }
  }, [status, tick]);
}
