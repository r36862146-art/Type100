import { typingEngine } from "../src/features/typing/engine/typingEngine";
import { parseTextToModel } from "../src/features/typing/parser";
import { useTypingStore } from "../src/features/typing/store";
import { timer } from "../src/features/typing/engine/timer";
import { statistics } from "../src/features/typing/engine/statistics";
import { DEFAULT_TYPING_CONFIG } from "../src/features/typing/constants";

console.log("Starting integration test for Practice Mode Timers...");

const text = "hi there";
const initialConfig = { ...DEFAULT_TYPING_CONFIG, mode: "time" as const, timeLimit: 15 };

useTypingStore.getState().initSession(text, initialConfig);

let state = useTypingStore.getState();

console.log("Initial state:", state.status, " remaining time:", state.stats.remainingTime);

// Type out the text very fast, multiple times
const typeString = (str: string) => {
  for (const key of str) {
    useTypingStore.getState().handleKeystroke(key);
    state = useTypingStore.getState();
    if (state.status === "finished") {
      console.error("FAILED! Ended early on keystroke:", key);
      process.exit(1);
    }
  }
};

typeString("hi there");
console.log("Typed first time. Words count:", state.words.length, "Status:", state.status);
typeString(" ");
typeString("hi there");
console.log("Typed second time. Words count:", state.words.length, "Status:", state.status);

// Simulate ticking the timer down to 0
for (let i = 0; i < 15; i++) {
  useTypingStore.getState().tick(1000);
  state = useTypingStore.getState();
  if (i < 14 && state.status === "finished") {
    console.error("FAILED! Ended early at second", i);
    process.exit(1);
  }
}

if (state.status !== "finished") {
  console.error("FAILED! Did not end after 15 seconds.");
  process.exit(1);
}

console.log("SUCCESS! Practice mode behaves correctly and only ends when the timer reaches 0.");
