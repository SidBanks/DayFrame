# DayFrame Roadmap

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Roadmap  
**Status:** Draft v0.1  
**Purpose:** Define phased development to maintain focus and prevent scope creep.

---

## 1. Roadmap Philosophy

DayFrame must be built in controlled phases.

Rules:

- Solve real user pain first (shift transitions)
- Ship usable slices early
- Avoid overbuilding integrations
- Validate with real usage (dogfooding)
- Expand only after core engine proves reliable

---

## 2. Phase 0 — Core Engine (Foundation)

**Goal:** Build and validate the scheduling brain

### Includes:

- User day boundary logic
- User week boundary logic
- Shift definitions
- Shift cycles (fixed segments)
- Block templates
- Priority system
- Basic rule engine
- Transition detection
- Friction detection
- Schedule generator (no UI dependency)

### Output:

- Tested engine functions
- CLI or simple debug output
- Unit test coverage

### Exit Criteria:

- Engine produces correct schedules
- Transition logic behaves predictably
- No UI required to validate logic

---

## 3. Phase 1 — MVP (Local App)

**Goal:** Usable personal tool (your daily driver)

### Includes:

- Mobile-first UI
- Today view
- Week view
- Generate flow
- Friction review
- Fix system
- Tool/resource attachments
- Manual block tracking
- `.ics` export

### Excludes:

- Accounts
- Cloud sync
- API integrations

### Output:

- Fully usable local app
- Daily usage possible

### Exit Criteria:

- You use DayFrame daily
- Transition weekends are improved
- Schedule generation trusted

---

## 4. Phase 2 — Sync & Sharing

**Goal:** Multi-device + early network effects

### Includes:

- User accounts
- Cloud persistence
- Multi-device sync
- Template save/load
- Template sharing (link-based)
- Improved rule customization

### Output:

- Users can access DayFrame anywhere
- Templates can be reused/shared

### Exit Criteria:

- Seamless device switching
- No data loss issues
- Sharing works reliably

---

## 5. Phase 3 — Calendar Integration

**Goal:** Remove friction between DayFrame and existing calendars

### Includes:

- Google Calendar OAuth
- Event push/update
- Sync mapping
- Conflict-safe updates

### Later:

- Outlook integration
- Apple Calendar integration

### Exit Criteria:

- Reliable sync
- No duplicate events
- Users trust sync behavior

---

## 6. Phase 4 — Notifications & Mobile Polish

**Goal:** Make DayFrame proactive

### Includes:

- Push notifications
- Reminder escalation
- Better Today screen
- Faster interactions
- PWA install
- Optional Capacitor wrapper

### Exit Criteria:

- Users rely on notifications
- App feels “alive”

---

## 7. Phase 5 — Advanced Features

**Goal:** Expand power without breaking simplicity

### Includes:

- Visual rule builder (Scratch-style)
- Smart suggestions
- Basic analytics
- Improved transitions logic
- Better planning insights

---

## 8. Phase 6 — Ecosystem & Growth

**Goal:** Expand user base and use cases

### Includes:

- Deep integrations (Notion, Todoist, etc.)
- Template marketplace
- Team/shared planning
- Premium features

---

## 9. Anti-Goals (Always Avoid)

Do NOT:

- Build everything at once
- Add integrations before engine stability
- Replace all other tools
- Overcomplicate UI early
- Add AI features before core is proven

---

## 10. Current Focus

👉 You are here:

**Phase 0 → Phase 1 transition**

Next actions:

- Finalize specs (done)
- Begin engine implementation
- Write tests first
- Build minimal UI after engine works

---

## 11. Success Definition

DayFrame succeeds when:

- It reduces transition stress
- It replaces mental scheduling load
- It becomes part of daily routine
- It feels simple despite complex logic

---

## 12. Summary

Build in layers:

1. Engine
2. Usable app
3. Sync
4. Integration
5. Expansion

Stay disciplined.

---

**Reminder:**
If it doesn’t help someone survive a shift change, it’s not the priority.
