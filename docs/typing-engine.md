# Type100 Typing Engine

The Type100 Engine is a high-performance, completely deterministic, and decoupled system for driving the typing test experience. It is separated into three distinct layers: Parser, Engine (Business Logic), and Store (State).

## 1. Architecture

- **Parser Layer**: Converts a raw target string into a predictable DOM-like array of `Word` and `Character` models. This allows stable identifiers and prevents rescanning.
- **Engine Layer**: Pure, stateless mathematical modules (`typingEngine`, `statistics`, `calculator`, `matcher`, `cursor`, `timer`). They take a state and an input, and strictly return the next state alongside organic `EngineEvent` objects.
- **Store Layer**: The Zustand store merely acts as a thin wrapper that pipes actions (e.g. `handleKeystroke`) through the Engine Layer, reducing the events to generate real-time metrics.

## 2. Module Responsibilities

- **`typingEngine`**: The core orchestrator. Returns the next state cursor, validates character logic, and emits `BACKSPACE` or `CHARACTER_CORRECT` events.
- **`statistics`**: Consumes typing events and acts as a strict O(1) reducer for keystroke counts.
- **`calculator`**: The math utility that computes derivatives (WPM, Accuracy) with 100% safety against zero bounds.
- **`timer`**: Decoupled interval runner that calculates elapsed and remaining time.
- **`validator`**: Safely drops non-typing characters (Ctrl, Tab, Escape).

## 3. State Machine & Event System

The engine moves through three distinct phases: `idle` -> `running` -> `finished`.
- `idle`: Waits for the `FIRST_KEY` event.
- `running`: Constantly processes keystrokes and advances the cursor.
- `finished`: Triggers `SESSION_COMPLETED` when the cursor naturally falls off the bounds of the provided text lengths.

Because the system uses an event model, external components like sound engines or remote analytics can listen to the event bus without polluting the core typing logic.

## 4. Public API

To consume the engine in React, you only need to interact with the top-level barrel `src/features/typing/index.ts`:

\`\`\`typescript
import { 
  useTypingActions, 
  useTypingStatus, 
  useTypingStats 
} from "@/features/typing";

// Stable selectors guarantee zero wasted renders
const { handleKeystroke, initSession, resetSession } = useTypingActions();
const status = useTypingStatus();
const { wpm, accuracy } = useTypingStats();
\`\`\`

## 5. Extension Guidelines

Because the `Word` and `Character` schema is driven purely by lengths and mapped IDs, the engine natively supports:
- **Hindi Typing**: So long as the font and parser are configured to handle Unicode clusters, the state machine sees it as standard characters.
- **Custom Text / Government Exam Passages**: Just pass the large text into `initSession(hugeText)`. The cursor engine will mathematically advance regardless of text length.
- **Practice Modes**: The modular `timer.ts` supports switching from strict countdowns to infinite count-up modes seamlessly.
