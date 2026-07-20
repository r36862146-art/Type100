# Andaman & Nicobar Administration Exam Module — Phase 8.4

Typing skill test support for Andaman & Nicobar Administration recruitment examinations, covering Combined Higher Secondary Level (CHSL) and Common Matriculation Level (MTS).

Built on the Phase 8.1 examRegistry architecture — zero modifications to shared engines.

---

## Supported Posts

| Post | Exam | Language | Target WPM | Accuracy | Duration | Type |
|---|---|---|---|---|---|---|
| Lower Division Clerk | CHSL | English | 35 WPM | 90% | 10 min | Official |
| Lower Division Clerk | CHSL | Hindi | 30 WPM | 90% | 10 min | Official |
| Multi-Tasking Staff | MTS | English | 25 WPM | 85% | 10 min | **Practice Only** |

**Note on MTS:** Real-world MTS recruitment does not mandate a typing skill test. It is included here as a preparatory, practice-only path for candidates to build foundational skills before attempting CHSL.

---

## Architecture

```
features/exam/andaman/
│
├── registry/                    Phase 8.4 — Andaman exam profiles
│   ├── chsl.ts                  LDC English + LDC Hindi
│   ├── matriculation.ts         MTS English (practice-only)
│   └── index.ts                 registerAndamanExams()
│
├── assets/
│   └── examBranding.ts          Centralised strings, instruction text, colours
│
├── services/                    Pure functions, no side effects
│   ├── andamanRules.ts          AndamanRules + per-post configs
│   ├── scoring.ts               Gross/net WPM, error breakdown
│   ├── passageLoader.ts         JSON datasets with `topic` metadata
│   ├── qualification.ts         Wrappers around Phase 8.1 engines
│   └── validation.ts            Character validation + CharState
│
├── datasets/
│   ├── english/
│   │   ├── chsl.json            5 passages · 35 WPM
│   │   └── mts.json             5 passages · 25 WPM (easy)
│   ├── hindi/
│   │   └── chsl.json            5 passages · 30 WPM
│   └── metadata/
│       └── index.json           v1.0.0 metadata
│
├── simulator/                   React components
│   ├── AndamanSimulator.tsx     State machine orchestrator
│   ├── TypingSkillTest.tsx      Active typing area
│   ├── Instructions.tsx         Pre-exam screen
│   └── CompletionScreen.tsx     Results + readiness + error breakdown
│
├── hooks/
│   ├── useAndamanSimulator.ts   Phase state machine
│   └── useAndamanSettings.ts    localStorage persistence
│
└── __tests__/                   98 pure-function & integration tests
```

---

## Scoring Formula

Uses the standard government formula:

```
Gross WPM = total characters typed / 5 / elapsed minutes
Net WPM   = (gross characters − error penalty chars) / 5 / elapsed minutes
Error penalty = errors × 1 word × 5 chars
Accuracy  = (correct chars / gross chars) × 100
```

---

## How to Update Instructions or Text

All human-readable strings are in `assets/examBranding.ts`. Do not hardcode strings in React components. If the Andaman administration changes the rules or naming, update `examBranding.ts` and it will propagate everywhere.

---

## Practice Modes

- `practice_unlimited`
- `practice_timed`
- `official_full`
- `official_qualifying`
- `weak_numbers`
- `weak_capitals`
- `weak_punctuation`
- `weak_long_words` (Andaman specific — targets words > 8 characters)

---

## Running Tests

The test suite consists of 6 files running on the native Node.js test runner via `tsx`.

```bash
# Run all Andaman tests
npx tsx --test "src/features/exam/andaman/__tests__/*.test.ts"
```

---

## Phase Roadmap

| Phase | Status | Scope |
|---|---|---|
| 8.1 | ✅ Complete | ExamRegistry, ExamProfile, readinessEngine |
| 8.2 | ✅ Complete | SSC CGL + CHSL simulator |
| 8.3 | ✅ Complete | RRB NTPC + Typing Posts simulator |
| **8.4** | **✅ Complete** | **Andaman & Nicobar Administration simulator** |
| 8.5 | Planned | UPSC / State PSC stubs |
