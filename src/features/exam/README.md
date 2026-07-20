# Government Exam Framework — Architecture Documentation

## Overview

The Exam Framework (`src/features/exam/`) provides reusable, registry-driven infrastructure for every government typing exam supported by Type100. It is fully decoupled from the Typing Engine and Practice Module.

---

## Directory Structure

```
src/features/exam/
├── types/index.ts           — All shared TypeScript interfaces
├── constants/index.ts       — Labels, thresholds, storage keys
├── registry/examRegistry.ts — Singleton ExamRegistry
├── services/
│   ├── readinessEngine.ts   — Pure readiness computation
│   ├── qualificationEngine.ts — Pure qualification computation
│   ├── examLoader.ts        — Lazy-load profiles from registry
│   └── progressService.ts   — localStorage-backed progress tracking
├── hooks/useExam.ts         — Composing React hook
├── components/              — All shared UI components
│   ├── ExamSelector.tsx     — Hierarchical org→exam→post→language→start
│   ├── ExamCard.tsx         — Compact exam summary card
│   ├── ExamHeader.tsx       — Full-width active exam banner
│   ├── ExamInfo.tsx         — Detailed exam profile panel
│   ├── ReadinessCard.tsx    — WPM/accuracy vs target display
│   ├── QualificationStatus.tsx — Qualification status & next goal
│   └── ProgressCard.tsx     — Attempt history & best performance
└── __tests__/               — Unit tests
```

---

## Core Design Principles

### 1. Registry-First Architecture

All exam data flows from **`examRegistry`** (a singleton `Map<ExamId, ExamProfile>`). Components never hardcode exam information — they query the registry.

```
Government Exams
      ↓
ExamRegistry (source of truth)
      ↓
ExamProfile (canonical interface)
      ↓
readinessEngine / qualificationEngine (pure functions)
      ↓
React Components (display only)
```

### 2. Pure Engines

Both `readinessEngine` and `qualificationEngine` are pure functions with zero side effects:

```ts
computeReadiness(snapshot: ResultsSnapshot, profile: ExamProfile): ReadinessReport
computeQualification(snapshot: ResultsSnapshot, profile: ExamProfile): QualificationResult
```

No React. No DOM. Fully testable in isolation.

### 3. Cloud-Sync-Ready Progress

`progressService` uses a `StorageStrategy` interface. The default implementation uses `localStorage`, but any alternative (IndexedDB, Supabase, Firebase) can be injected without changing calling code.

---

## How to Add a New Exam

1. **Define the ExamProfile** in `registry/examRegistry.ts` inside the `INITIAL_PROFILES` array:

```ts
{
  id: "upsc_csat",           // unique ExamId — add to ExamId union in types/index.ts
  organization: "UPSC",       // add to ExamOrganization union if new
  exam: "Civil Services Aptitude Test",
  post: "Assistant Section Officer",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["government", "general"],
  description: "CSAT typing component for ASO posts.",
}
```

2. **Add the ID** to the `ExamId` union type in `types/index.ts`.
3. **That's it.** The selector, cards, engines, and hooks all automatically pick it up.

---

## How to Add a New Organization

1. Add the new org name to the `ExamOrganization` union type in `types/index.ts`.
2. Add its display label and abbreviation in `constants/index.ts`:
   ```ts
   ORGANIZATION_LABELS["UPSC"] = "Union Public Service Commission (UPSC)"
   ORGANIZATION_ABBREVIATIONS["UPSC"] = "UPSC"
   ```
3. Register exam profiles using the new org.

---

## How to Add a New Post

A "post" is simply a new `ExamProfile` entry with the same `organization` and `exam` fields but a different `post` name and potentially different qualifying criteria. The `getPostsForExam()` method will return all matching profiles.

---

## How to Add Passages (Phase 8.2+)

Passages are defined using the `ExamPassage` interface (already in `types/index.ts`). Future implementation:

1. Create `content/passages/<examId>.json` with an array of `ExamPassage` objects.
2. Create a loader in `services/passageLoader.ts` that reads and caches the JSON.
3. Wire the passage loader into the Practice Framework's `PracticeProvider` interface.

The `ExamPassage` interface already includes `organization`, `exam`, `post`, `language`, `difficulty`, and `category` for precise filtering.

---

## ExamProfile Interface Reference

| Field | Type | Description |
|---|---|---|
| `id` | `ExamId` | Unique identifier |
| `organization` | `ExamOrganization` | SSC, RRB, Andaman |
| `exam` | `string` | Full official exam name |
| `post` | `string` | Official post name |
| `language` | `ExamLanguage` | `en` or `hi` |
| `duration` | `number` | Test duration in minutes |
| `qualifyingSpeed` | `number` | Minimum WPM to qualify |
| `qualifyingAccuracy` | `number` | Minimum accuracy % to qualify |
| `typingTestRequired` | `boolean` | Whether typing test is mandatory |
| `timerEnabled` | `boolean` | Whether live timer is shown |
| `passageCategories` | `PassageCategory[]` | Topics used in passages |
| `description` | `string` | Human-readable summary |
| `metadata` | `Record<string, ...>` | Optional extra data |

---

## Analytics & Telemetry

The `useExam` hook exposes `recordAttempt(snapshot)` which writes to `progressService`. Future analytics hooks (Phase 9+) can listen to this via the same `CustomEvent` pattern used in the Practice Module.
