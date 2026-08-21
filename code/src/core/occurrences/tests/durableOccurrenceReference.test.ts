import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../../authored/sourceIncarnation.js";
import { generateBlockCandidates } from "../../blocks/generateBlockCandidates.js";
import { generateCycleWorkBlocks } from "../../cycles/generateCycleWorkBlocks.js";
import { instantiateActiveSetup } from "../../../state/activeV2.js";
import type { DayFrameAuthoredPattern, DayFrameAuthoredSetup } from "../../../state/types.js";
import { createManualEventOccurrenceIdentity } from "../occurrenceIdentity.js";
import {
  createDurableOccurrenceReference,
  durableOccurrenceReferencesEqual,
  resolveDurableOccurrenceReference,
  validateDurableOccurrenceReference,
} from "../durableOccurrenceReference.js";

const pattern: DayFrameAuthoredPattern = {
  schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "monday" },
  previewRange: { preset: "oneWeek", startDate: "2026-08-17", endDate: "2026-08-23" },
  shiftDefinitions: [{ id: "shift", userId: "user", name: "Night", startTime: "22:00",
    endTime: "06:00", workDays: ["monday"], crossesMidnight: true,
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
  shiftCycles: [{ id: "cycle", userId: "user", name: "Cycle", type: "fixedSegments",
    mode: "manualSegments", startsOnDate: "2026-08-01", endsOnDate: "2026-08-31",
    createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z",
    segments: [{ id: "segment", shiftCycleId: "cycle", shiftDefinitionId: "shift",
      startsOnDate: "2026-08-01", endsOnDate: "2026-08-31" }] }],
  blockTemplates: [{ id: "template", userId: "user", title: "Workout", category: "fitness",
    placementType: "flexible", durationMinutes: 30, priority: 2,
    preferredWindow: "anyAvailable", rescheduleBehavior: "askUser", requiresResource: false,
    externalResources: [], enabled: true, createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z" }],
  blockRecurrences: [{ id: "recurrence", blockTemplateId: "template", frequency: "daily" }],
  manualEvents: [{ id: "manual", title: "Appointment", userDayDate: "2026-08-20",
    allDay: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" }],
};

function allocator(start = 1) {
  let next = start;
  return () => `00000000-0000-4000-8000-${String(next++).padStart(12, "0")}` as SourceIncarnationId;
}

function active(start = 1): DayFrameAuthoredSetup {
  return instantiateActiveSetup(pattern, allocator(start));
}

function templateIdentity(state: DayFrameAuthoredSetup) {
  return generateBlockCandidates({
    blockTemplates: state.blockTemplates,
    blockRecurrences: state.blockRecurrences,
    shiftCycles: state.shiftCycles,
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: new Date("2026-08-20T00:00:00"),
    planningWindowEnd: new Date("2026-08-21T00:00:00"),
  })[0]!.occurrenceIdentity!;
}

function workIdentity(state: DayFrameAuthoredSetup) {
  return generateCycleWorkBlocks({
    shiftCycles: state.shiftCycles,
    shiftDefinitions: state.shiftDefinitions,
    defaultSchedulingPreferences: state.schedulingPreferences,
    planningWindowStart: new Date("2026-08-17T00:00:00"),
    planningWindowEnd: new Date("2026-08-18T12:00:00"),
  })[0]!.occurrenceIdentity!;
}

function created(identity: Parameters<typeof createDurableOccurrenceReference>[0], state: DayFrameAuthoredSetup) {
  const result = createDurableOccurrenceReference(identity, state);
  expect(result.status).toBe("created");
  if (result.status !== "created") throw new Error("reference was not created");
  return result.reference;
}

describe("DurableOccurrenceReference V1", () => {
  it("constructs and resolves template, overnight work, and manual families", () => {
    const state = active();
    const references = [
      created(templateIdentity(state), state),
      created(workIdentity(state), state),
      created(createManualEventOccurrenceIdentity("manual"), state),
    ];
    expect(references.map((reference) => reference.sourceKind)).toEqual(["template", "work", "manualEvent"]);
    for (const reference of references) {
      expect(resolveDurableOccurrenceReference(reference, state).status).toBe("resolved");
    }
    expect(references[1]).toMatchObject({ sourceKind: "work",
      coordinate: { localStartDate: "2026-08-17", slot: 0 } });
  });

  it("is stable across construction, JSON roundtrip, regeneration, and clone boundaries", () => {
    const state = active();
    const first = created(templateIdentity(state), state);
    const second = created(templateIdentity(state), state);
    expect(durableOccurrenceReferencesEqual(first, second)).toBe(true);
    const parsed: unknown = JSON.parse(JSON.stringify(first));
    const validation = validateDurableOccurrenceReference(parsed);
    expect(validation.status).toBe("valid");
    if (validation.status === "valid") {
      expect(durableOccurrenceReferencesEqual(first, validation.reference)).toBe(true);
      if (validation.reference.sourceKind === "template") validation.reference.template.id = "changed";
    }
    expect(state.blockTemplates[0]!.id).toBe("template");
    expect(first.sourceKind === "template" && first.template.id).toBe("template");
  });

  it("strictly rejects malformed, cross-family, invalid date/slot, and future-version input", () => {
    const state = active();
    const reference = created(templateIdentity(state), state);
    expect(validateDurableOccurrenceReference({ ...reference, unexpected: true }).status).toBe("invalid");
    expect(validateDurableOccurrenceReference({ ...reference, version: 2 }).status).toBe("unsupportedVersion");
    expect(validateDurableOccurrenceReference({ ...reference, coordinate: {
      frequency: "daily", scopeKind: "userDay", userDayDate: "2026-02-30", slot: -1,
    } }).status).toBe("invalid");
    expect(validateDurableOccurrenceReference({ version: 1, sourceKind: "manualEvent",
      manualEvent: (reference as { template: unknown }).template, coordinate: {} }).status).toBe("invalid");
  });

  it("distinguishes source deletion, lifetime mismatch, and occurrence removal", () => {
    const state = active();
    const reference = created(templateIdentity(state), state);
    expect(resolveDurableOccurrenceReference(reference, { ...state, blockTemplates: [] })).toEqual(
      { status: "sourceMissing", component: "template" },
    );
    const recreated = active(101);
    expect(resolveDurableOccurrenceReference(reference, recreated)).toEqual(
      { status: "lifetimeMismatch", component: "template" },
    );
    const updated = { ...state, blockRecurrences: state.blockRecurrences.map((source) => ({
      ...source, startsOnDate: "2026-08-21" as const,
    })) };
    expect(resolveDurableOccurrenceReference(reference, updated).status).toBe("occurrenceMissing");
  });

  it("diagnoses each work lineage component and nested parent recreation", () => {
    const state = active();
    const reference = created(workIdentity(state), state);
    const newGraph = active(101);
    expect(resolveDurableOccurrenceReference(reference, newGraph)).toEqual(
      { status: "lifetimeMismatch", component: "cycle" },
    );
    const entryChanged = { ...state, shiftCycles: state.shiftCycles.map((cycle) => ({ ...cycle,
      segments: cycle.segments.map((entry) => ({ ...entry,
        incarnationId: newGraph.shiftCycles[0]!.segments[0]!.incarnationId })) })) };
    expect(resolveDurableOccurrenceReference(reference, entryChanged)).toEqual(
      { status: "lifetimeMismatch", component: "entry" },
    );
    const shiftChanged = { ...state, shiftDefinitions: state.shiftDefinitions.map((shift) => ({
      ...shift, incarnationId: newGraph.shiftDefinitions[0]!.incarnationId })) };
    expect(resolveDurableOccurrenceReference(reference, shiftChanged)).toEqual(
      { status: "lifetimeMismatch", component: "shiftDefinition" },
    );
  });

  it("keeps manual references resolved after an ordinary move", () => {
    const state = active();
    const reference = created(createManualEventOccurrenceIdentity("manual"), state);
    const moved = { ...state, manualEvents: state.manualEvents.map((event) => ({ ...event,
      userDayDate: "2026-09-01" as const, title: "Moved" })) };
    expect(resolveDurableOccurrenceReference(reference, moved).status).toBe("resolved");
  });

  it("returns explicit construction failures instead of fabricating lineage", () => {
    const state = active();
    expect(createDurableOccurrenceReference(createManualEventOccurrenceIdentity("missing"), state))
      .toEqual({ status: "missingSourceLineage", component: "manualEvent" });
  });
});
