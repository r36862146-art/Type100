# SSC Exam Module — Architecture Documentation

## Overview

The SSC module (`src/features/exam/ssc/`) implements production-ready simulation for SSC CGL and SSC CHSL typing tests. It is built entirely on top of the Phase 8.1 Exam Framework and does not modify any shared infrastructure.

---

## Directory Structure

```
src/features/exam/ssc/
├── registry/
│   ├── cgl.ts          — ExamProfile definitions for CGL (DEST, CPT stub)
│   ├── chsl.ts         — ExamProfile definitions for CHSL (LDC/JSA, DEO)
│   └── index.ts        — registerSSCExams() entry point
├── datasets/
│   ├── cgl/
│   │   ├── en.json     — 5 English passages calibrated for CGL DEST
│   │   └── hi.json     — 5 Hindi passages calibrated for CGL DEST
│   ├── chsl/
│   │   ├── en.json     — 5 English passages calibrated for CHSL LDC
│   │   └── hi.json     — 5 Hindi passages calibrated for CHSL LDC
│   └── metadata/
│       └── index.json  — Dataset version metadata
├── simulator/
│   ├── ExamInstructions.tsx  — Pre-exam instruction screen
│   ├── SSCSimulator.tsx      — Main orchestrator (state machine)
│   ├── DESTMode.tsx          — DEST-specific layout
│   └── TypingMode.tsx        — Shared typing area base
├── services/
│   ├── sscRules.ts           — SSCRules interface + per-exam configs
│   ├── passageLoader.ts      — Lazy-loading + caching loader
│   ├── scoring.ts            — Gross WPM, net WPM, KPH, error penalty
│   └── validation.ts        — Character-level validation, CharState
├── hooks/
│   └── useSSCSimulator.ts    — Simulator state machine hook
└── __tests__/
    ├── sscRules.test.ts
    ├── scoring.test.ts
    ├── validation.test.ts
    ├── passageLoader.test.ts
    └── simulator.test.ts (also covers registry)
```

---

## Simulation State Machine

```
idle
  ↓ showInstructions()
instructions
  ↓ startCountdown()
countdown (3-2-1)
  ↓ auto
active (timer running)
  ↓ submitSession() or auto-submit at T=0
results
```

---

## SSC Rules Configuration

Every exam's behaviour is driven by an `SSCRules` object — no logic in components.

| Field | Type | Description |
|---|---|---|
| `targetSpeed` | `number` | WPM or KPH target |
| `targetAccuracy` | `number` | Minimum accuracy % |
| `duration` | `number` | Minutes |
| `qualifyingType` | `"wpm" \| "keystrokes_per_hour"` | Scoring mode |
| `targetKPH` | `number?` | Required for DEO mode |
| `liveStatistics` | `boolean` | Show live WPM during test |
| `officialSimulation` | `boolean` | No-pause mode |
| `autoSubmit` | `boolean` | Auto-submit at timer expiry |
| `allowRestart` | `boolean` | Allow restart before results |
| `fontSizePx` | `number` | Official font size |
| `lineHeightPx` | `number` | Official line height |
| `passageWidthCh` | `number` | Passage width in characters |

---

## Scoring Formula

### WPM Posts (CGL DEST, CHSL LDC/JSA)
- **Gross WPM** = total characters / 5 / elapsed minutes
- **Error Penalty** = errors × 1 word (SSC standard)
- **Net WPM** = (total characters − error_penalty × 5) / 5 / elapsed minutes

### DEO Posts (CHSL DEO)
- **KPH** = total keystrokes / elapsed hours
- Qualifying: KPH ≥ 8,000 AND accuracy ≥ 90%

---

## How to Add a New SSC Post

1. Add a new `ExamProfile` to the appropriate registry file (`cgl.ts` or `chsl.ts`).
2. Add a new rule config to `sscRules.ts` (no magic numbers).
3. Add passages to the appropriate dataset JSON file.
4. Update `metadata/index.json` with the new passage count.
5. Export from `registry/index.ts`.

That's it — the simulator, selector, and engines pick up the new post automatically.

---

## How to Add Passages

Passages follow the `SSCPassage` interface:

```json
{
  "id": "ssc_cgl_en_006",
  "exam": "ssc_cgl",
  "post": "Tax Assistant / Upper Division Clerk",
  "language": "en",
  "title": "Passage Title",
  "difficulty": "medium",
  "category": "general",
  "text": "Full passage text here...",
  "characterCount": 950,
  "estimatedWpm": 35,
  "estimatedDuration": 15
}
```

Add to the appropriate JSON file and update `metadata/index.json`.

---

## Future CPT Integration

SSC CGL CPT (Computer Proficiency Test) requires Word/Excel skills beyond typing. The `SSC_CGL_CPT_STUB` profile is registered with `metadata.stub: true`. Phase 9+ will:

1. Create a `cpt/` directory with a CPT simulator component.
2. Register the full CPT profile (replacing the stub).
3. The ExamSelector will automatically surface it.

---

## Integration with Phase 8.1 Exam Framework

The SSC module connects to the Exam Framework at exactly one point: `registerSSCExams()` in `registry/index.ts`. This is the only file that calls `examRegistry.registerAll()`. All other SSC code operates independently.

```ts
// In your app root layout or entry point:
import { registerSSCExams } from "@/features/exam/ssc/registry";
registerSSCExams();
```
