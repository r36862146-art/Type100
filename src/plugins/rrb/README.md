# RRB Typing Skill Test Module — Phase 8.3

Railway Recruitment Board (RRB) typing test support for Type100. Built entirely on the Phase 8.1 examRegistry and Phase 8.2 SSC patterns — no modifications to the Typing Engine, Results System, Practice Framework, or SSC Module.

---

## Architecture

```
features/exam/rrb/
│
├── registry/                    Phase 8.3 — RRB exam profiles
│   ├── ntpc.ts                  6 NTPC post profiles (4 posts × 2 languages)
│   ├── posts.ts                 2 RRB Typing Post profiles
│   └── index.ts                 registerRRBExams() — call once at app boot
│
├── services/                    Pure functions, no side effects
│   ├── rrbRules.ts              RRBRules interface + per-post rule configs
│   ├── scoring.ts               Gross/net WPM, accuracy, error breakdown
│   ├── passageLoader.ts         Lazy-loading JSON datasets with cache
│   ├── qualification.ts         Wrappers around Phase 8.1 engines
│   └── validation.ts            Character-level validation + CharState
│
├── datasets/
│   ├── english/
│   │   ├── ntpc.json            5 passages · 30 WPM · English
│   │   └── typing_posts.json   5 passages · 40 WPM · English
│   ├── hindi/
│   │   └── ntpc.json            5 passages · 25 WPM · Hindi
│   └── metadata/
│       └── index.json           Dataset version + passage counts
│
├── simulator/                   React components (client-side)
│   ├── RRBSimulator.tsx         Main orchestrator (state machine)
│   ├── TypingSkillTest.tsx      Active typing area + live stats
│   ├── Instructions.tsx         Pre-exam instruction screen
│   └── CompletionScreen.tsx     Results + readiness + recommendations
│
├── hooks/
│   ├── useRRBSimulator.ts       State machine hook (drives RRBSimulator)
│   └── useRRBSettings.ts        localStorage persistence for settings
│
├── __tests__/
│   ├── rrbRules.test.ts         Rules engine test suite
│   ├── scoring.test.ts          Scoring engine test suite
│   ├── passageLoader.test.ts    Dataset loader integration tests
│   ├── qualification.test.ts    Qualification/readiness test suite
│   ├── validation.test.ts       Character validation test suite
│   └── simulator.test.ts        Timer/auto-submit/phase logic tests
│
└── README.md                    This file
```

---

## Supported Posts

| Post | Exam | Language | Target WPM | Accuracy | Duration |
|---|---|---|---|---|---|
| Junior Clerk cum Typist | RRB NTPC | English | 30 WPM | 90% | 10 min |
| Junior Clerk cum Typist | RRB NTPC | Hindi | 25 WPM | 90% | 10 min |
| Accounts Clerk cum Typist | RRB NTPC | English | 30 WPM | 90% | 10 min |
| Junior Time Keeper | RRB NTPC | English | 30 WPM | 90% | 10 min |
| Senior Clerk cum Typist | RRB NTPC | English | 30 WPM | 90% | 10 min |
| Senior Clerk cum Typist | RRB NTPC | Hindi | 25 WPM | 90% | 10 min |
| Typist Grade III | RRB Typing Posts | English | 40 WPM | 92% | 10 min |
| Stenographer Grade D | RRB Typing Posts | English | 40 WPM | 92% | 10 min |

---

## Scoring Formula

RRB uses the standard government examination formula:

```
Gross WPM = total characters typed / 5 / elapsed minutes
Net WPM   = (gross characters − error penalty chars) / 5 / elapsed minutes
Error penalty = errors × 1 word × 5 chars per word
Accuracy  = (correct chars / gross chars) × 100
```

**Qualification** requires **both**:
- Net WPM ≥ target WPM
- Accuracy ≥ target accuracy

---

## Practice Modes

| Mode | Description |
|---|---|
| `practice_unlimited` | No timer, unlimited attempts |
| `practice_timed` | 5-minute timed sessions with pause/restart |
| `official_full` | 10-minute official simulation (no pause) |
| `official_qualifying` | Qualifying test mode |
| `weak_numbers` | Focus on number characters (0-9) |
| `weak_capitals` | Focus on capital letters (A-Z) |
| `weak_punctuation` | Focus on punctuation marks |

---

## Registry Architecture

```
ExamOrganization ("RRB")
    ↓
ExamProfile (in examRegistry)
    ↓
RRBRules (in rrbRules.ts)
    ↓
RRBPassage (from passageLoader.ts)
    ↓
useRRBSimulator (state machine)
    ↓
RRBSimulator (React component)
```

The `registerRRBExams()` function is the **only** integration point with the Phase 8.1 `examRegistry`. Nothing else touches external infrastructure.

---

## How to Add a New Post

1. **Add the ExamProfile** in `registry/ntpc.ts` or `registry/posts.ts`:

```ts
export const RRB_NTPC_NEW_POST_EN: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "New Post Name",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description: "...",
  metadata: { postCode: "NPO", qualifyingType: "wpm", allowLiveStats: true,
    officialFontSizePx: 16, officialLineHeightPx: 28, officialPassageWidthCh: 80 },
};
```

2. **Add to the array** at the bottom of the file and export it.
3. **Re-export** from `registry/index.ts`.
4. **That's it.** No rule changes needed unless WPM or duration differ.

---

## How to Add a New Dataset

1. Create a JSON file in `datasets/english/` or `datasets/hindi/`:

```json
[
  {
    "id": "rrb_ntpc_en_006",
    "exam": "rrb_ntpc",
    "post": "Junior Clerk cum Typist",
    "language": "en",
    "title": "Passage Title",
    "difficulty": "medium",
    "category": "general",
    "text": "The full passage text...",
    "characterCount": 950,
    "estimatedWpm": 30,
    "estimatedDuration": 10
  }
]
```

2. Add a dynamic import branch in `services/passageLoader.ts`:

```ts
} else if (examId === "rrb_ntpc" && language === "en") {
  // Already handled — just add your file to the same JSON array
}
```

3. Update `datasets/metadata/index.json` with the new `passageCount`.

---

## How to Update RRB Rules

All qualifying criteria are in `services/rrbRules.ts`. No component logic changes are needed:

```ts
const RRB_RULES: Record<string, RRBRules> = {
  rrb_ntpc_en: {
    targetWpm: 30,         // change here
    targetAccuracy: 90,    // and here
    duration: 10,
    // ...
  },
};
```

---

## Running Tests

```bash
# Individual suites
node --test src/features/exam/rrb/__tests__/rrbRules.test.ts
node --test src/features/exam/rrb/__tests__/scoring.test.ts
node --test src/features/exam/rrb/__tests__/passageLoader.test.ts
node --test src/features/exam/rrb/__tests__/qualification.test.ts
node --test src/features/exam/rrb/__tests__/validation.test.ts
node --test src/features/exam/rrb/__tests__/simulator.test.ts
```

---

## Settings Persistence

User settings stored in `localStorage` under key `type100_rrb_settings`:

```json
{
  "examId": "rrb_ntpc",
  "post": "Junior Clerk cum Typist",
  "language": "en",
  "practiceMode": "practice_timed",
  "simulationMode": "practice"
}
```

---

## Accessibility

- All interactive elements have `aria-label` attributes
- Timer uses `role="timer"` with `aria-live="polite"`
- Passage display uses `role="article"` and `aria-hidden="true"` on char spans
- Progress bar uses `role="progressbar"` with `aria-valuenow`
- All buttons have minimum 44px touch targets
- Instruction screen uses `role="dialog"` with `aria-modal="true"`
- Countdown uses `role="status"` with `aria-live="assertive"`

---

## Phase Roadmap

| Phase | Status | Scope |
|---|---|---|
| 8.1 | ✅ Complete | ExamRegistry, ExamProfile, readinessEngine |
| 8.2 | ✅ Complete | SSC CGL + CHSL simulator |
| **8.3** | **✅ Complete** | **RRB NTPC + Typing Posts simulator** |
| 8.4 | Planned | Andaman & Nicobar Administration |
| 8.5 | Planned | UPSC / state PSC stubs |
