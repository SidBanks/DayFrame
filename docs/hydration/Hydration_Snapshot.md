# DayFrame Hydration Snapshot (2026-05)

## 🧭 Product Identity
**Name:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  

**Core Idea:**
A shift-aware life scheduling system that adapts to rotating work schedules, protects sleep, and reduces transition friction.

---

## 🎯 Core Problem Solved
- Shift changes break routines
- Sleep cycles disrupted
- Planning tools don’t adapt
- Too many disconnected tools

DayFrame solves this by:
- Anchoring schedules to *user-defined day boundaries*
- Using *cycle-aware planning*
- Applying *priority + rule-based scheduling*
- Detecting *friction before execution*

---

## 🧠 Core System Components

### 1. Core Engine
- User day boundary (e.g., 3AM start)
- User week boundary
- Shift cycles (3-month, 4-month, custom)
- Block placement system
- Priority system (1–5)
- Transition detection
- Friction detection

---

### 2. Rule System
Plain-language rules:

WHEN → IF → THEN

Built-in rules:
- Conflict resolution
- Missed block handling
- Sleep-based adjustments
- Transition protection
- Resource validation

---

### 3. Data Model Highlights
- UserProfile
- ShiftDefinition
- ShiftCycle + ShiftSegment
- BlockTemplate
- ScheduledBlock
- Rule
- FrictionPoint
- ExternalResource

---

### 4. Workflow
Set Up → Templates → Attach Tools → Generate → Preview → Fix → Export

---

### 5. Integration Philosophy
- Orchestrates tools, does not replace them
- MVP: links + .ics export
- Later: Google Calendar sync + APIs

---

### 6. UI Direction
- Mobile-first
- Today view = primary screen
- Fast interaction (<30s adjustments)
- Minimal friction

---

## 🚀 Development Phases

### Phase 0 — Core Engine
Build and test scheduling logic

### Phase 1 — MVP
Local app, usable daily

### Phase 2 — Sync
Accounts + persistence

### Phase 3 — Calendar Integration
Google Calendar sync

---

## ⚠️ Guardrails
- No feature creep
- No overbuilt integrations
- Engine before UI polish
- Preview before export
- Always explain rule decisions

---

## 🎯 Immediate Next Step
Begin Phase 0:

1. Time utilities
2. User day boundary logic
3. User week boundary logic
4. Shift block generation

---

## 🧠 Key Insight
DayFrame is not a calendar.

It is:
> A system that prepares your life for change before it happens.
