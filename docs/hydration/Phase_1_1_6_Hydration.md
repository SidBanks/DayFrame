# DayFrame Hydration Update — Through Phase 1.1.6 Start

**Date:** 2026-05-03  
**Project:** DayFrame  
**Current Status:** Phase 1.1.6 ready to implement

---

## 🧠 Core Concept

DayFrame is a **shift-aware life scheduling system** that:

- Builds a **draft schedule preview**
- Detects **friction (conflicts, gaps, overload)**
- Suggests **fixes instead of auto-deciding**
- Lets the user stay in control

---

## 🔁 Core User Flow

```
Shift Setup → Cycle Setup → Template Editor → Preview → Apply Fix → Repeat
```

---

# ✅ ENGINE FOUNDATION (Phase 0.x)

## 0.1 — Time System
- Custom day boundaries
- Custom week starts
- User-day ownership

## 0.2 — Shift Definitions
- Work blocks generated from shifts
- Overnight handling

## 0.3 — Shift Cycles
- Fixed segments
- Inclusive date bounds
- Overnight belongs to shift start day

## 0.4 — Block Templates
- Categories, duration, priority
- Preferred windows
- Validation system (non-throwing)

## 0.5 — Candidate Generation
- Expands templates via recurrences
- Supports daily, weekly, weekdays, timesPerUserWeek

## 0.6 — Placement
- Deterministic anchoring only
- No conflict resolution yet

## 0.7 — Friction Detection
- Overlaps (work vs scheduled, scheduled vs scheduled)
- Unplaced candidates
- Severity system

## 0.8 — Suggested Fixes
- Context-aware fixes
- No state mutation

## 0.9 — Apply Fix
- Applies one fix deterministically
- Does NOT rerun friction

## 0.10 — Preview Pipeline
```
Work → Candidates → Placement → Friction → Suggested Fixes
```

## 0.11 — Revision Loop
```
Apply Fix → Re-detect → Re-suggest
```

## 0.12 — Hardening
- Edge-case coverage
- Invariant rules documented

---

# ✅ STATE LAYER (Phase 1.0.1)

## Store (Framework-free)

```ts
DayFrameState = {
  schedulingPreferences,
  shiftDefinitions,
  shiftCycle,
  blockTemplates,
  blockRecurrences,
  preview
}
```

## Key Actions

- setShiftDefinitions
- setShiftCycle
- setBlockTemplates
- setBlockRecurrences
- generatePreview
- applySuggestedFixToPreview

## Rules

- Store is source of truth
- Engine is pure
- UI reads store only

---

# ✅ UI FOUNDATION

## PreviewScreen
- Displays full preview
- Day-by-day grouping
- Shows friction + fixes

## DayFrameApp
- Supported application-level store → Preview bridge
- Subscribes to store state and renders `PreviewScreen` directly
- Owns Preview navigation, range context, and fixed-time review routing
- Generate Preview button

---

# ✅ SETUP UI (Phase 1.1)

## 1.1.1 — Shift Setup
- Edit shifts
- Add/remove
- Save to store

## 1.1.2 — Template Editor
- Edit templates
- Edit recurrences
- Add/remove
- Save to store

## 1.1.3 — Navigation (Shifts/Templates/Preview)

## 1.1.4 — Cycle Setup
- Edit cycle
- Edit segments
- Assign shifts

## 1.1.5 — Full Navigation

```
Shift Setup
Cycle Setup
Template Editor
Preview
```

All screens share ONE store instance.

---

# 🚧 CURRENT PHASE

## Phase 1.1.6 — Usability Guardrails (NOT IMPLEMENTED YET)

### Goal
Prevent invalid preview generation.

### Required before preview:

- ≥1 shift
- cycle exists
- ≥1 segment
- ≥1 template
- ≥1 recurrence

### Behavior

- Show message if missing
- Do NOT call generatePreview
- Clear message after success

---

# 🧭 CURRENT APP STATE

You now have:

- Full scheduling engine ✅
- Full preview loop ✅
- Full setup UI ✅
- Navigation between all parts ✅

### What’s missing

- Guardrails (1.1.6)
- Validation UX
- Persistence
- Mobile polish

---

# 📌 NEXT STEPS

1. Phase 1.1.6 — Guardrails
2. Phase 1.1.7 — Validation messaging
3. Phase 1.1.8 — Persistence
4. Phase 1.1.9 — UI polish

---

# ⚙️ DEV RULES

- No `any`
- camelCase only
- Engine is React-free
- Store is SSOT
- UI = thin layer

---

# 🧠 REHYDRATION SUMMARY

If you reopen this project, remember:

> DayFrame is a **deterministic preview + user-decision system**.

NOT:
- automatic scheduler
- black box optimizer

The loop is everything:

```
Preview → Friction → Fix → Preview
```

---

**End of Hydration File**
