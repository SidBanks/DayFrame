# DayFrame Integrations

**Product:** DayFrame  
**Tagline:** Built for life that doesn’t run 9 to 5.  
**Spec:** Integrations strategy  
**Status:** Draft v0.1  
**Purpose:** Define how DayFrame connects to external tools without becoming over-engineered.

---

## 1. Integration Philosophy

DayFrame is not trying to replace:

- Calendar apps
- Workout apps
- Meal planners
- Task managers
- Note tools

DayFrame is a **coordination layer**.

> It organizes _when_ things happen and links to _how_ they get done.

---

## 2. Integration Layers

### Layer 1 (MVP): Passive Integration

- URL links
- Notes
- Checklists
- `.ics` calendar export

### Layer 2 (V1): Active Calendar Sync

- Google Calendar API
- Event creation + updates

### Layer 3 (V2): Tool Integrations

- Notion
- Todoist
- Google Docs/Sheets
- Fitness apps
- Meal planners

---

## 3. MVP Integration Scope

Include:

- Attach URL to block
- Attach note/checklist
- Export `.ics` file
- Include links in calendar events

Do NOT include:

- OAuth login
- External API reads
- Sync back into DayFrame

---

## 4. Calendar Integration

### MVP

- Generate `.ics`
- User imports into calendar

### V1

- Google Calendar sync
- Create/update events

### Future

- Outlook
- Apple Calendar

---

## 5. Resource Attachments

Each block may include:

```ts
ExternalResource {
  type: "url" | "note" | "checklist"
  label: string
  value: string
}
```

Displayed in:

- App UI
- Calendar event description

---

## 6. Design Guardrails

- Never block scheduling due to missing integrations
- Always allow manual links
- Keep integrations optional
- Avoid dependency on external APIs for core functionality

---

## 7. Long-Term Vision

DayFrame becomes:

> The hub that connects time to action

---

## 8. Summary

MVP = simple + flexible

Future = connected + powerful

---

**Rule:**
If integration complexity delays core scheduling, it is not MVP.
