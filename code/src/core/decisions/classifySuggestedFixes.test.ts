import { describe, expect, it } from "vitest";
import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { FrictionPoint, SuggestedFix } from "../friction/types.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { PlanDecisionV1 } from "./planDecision.js";
import { classifySuggestedFixes } from "./classifySuggestedFixes.js";

describe("classifySuggestedFixes", () => {
  it("suppresses an exact equivalent and marks a differing same-target choice as superseding", () => {
    const equivalent = run(
      [fix("moveBlock", "a")],
      decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "10:00" }),
    );
    expect(equivalent[0]?.suggestedFixes).toEqual([]);
    const superseding = run(
      [fix("moveBlock", "a")],
      decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "11:00" }),
    );
    expect(superseding[0]?.suggestedFixes[0]?.decisionContext).toMatchObject({
      relationship: "superseding",
      explanationCode: "sameTarget",
    });
  });

  it("treats cross-kind same-target semantics as superseding and omit equivalence as equivalent", () => {
    expect(
      run(
        [fix("skipBlock", "a")],
        decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "09:00" }),
      )[0]?.suggestedFixes[0]?.decisionContext?.relationship,
    ).toBe("superseding");
    expect(run([fix("skipBlock", "a")], decision("omitOccurrence", {}))[0]?.suggestedFixes).toEqual(
      [],
    );
  });

  it("classifies direct different-target relationships conservatively", () => {
    const current = decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "09:00" });
    expect(
      run([fix("moveBlock", "b")], current, "applied")[0]?.suggestedFixes[0]?.decisionContext,
    ).toMatchObject({ relationship: "preserving", explanationCode: "constraintPreserved" });
    expect(
      run([fix("moveBlock", "b")], current, "blocked")[0]?.suggestedFixes[0]?.decisionContext,
    ).toMatchObject({ relationship: "unblocking", explanationCode: "blockedPlacement" });
    expect(
      run([fix("convertToRecovery", "b")], current, "applied")[0]?.suggestedFixes[0]
        ?.decisionContext?.relationship,
    ).toBe("unknown");
  });

  it("ranks preserving choices before superseding while retaining within-class order", () => {
    const fixes = [fix("moveBlock", "a"), fix("skipBlock", "a"), fix("moveBlock", "b")];
    const result = run(
      fixes,
      decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "11:00" }),
    );
    expect(
      result[0]?.suggestedFixes.map((item) => [item.id, item.decisionContext?.relationship]),
    ).toEqual([
      ["fix_move_b", "preserving"],
      ["fix_move_a", "superseding"],
      ["fix_skip_a", "superseding"],
    ]);
  });

  it("preserves original output exactly with no decisions or only stale/outside-window decisions", () => {
    const fixes = [fix("moveBlock", "a"), fix("skipBlock", "b")];
    expect(run(fixes, null)[0]?.suggestedFixes).toEqual(fixes);
    expect(
      run(
        fixes,
        decision("placeOccurrence", { userDayDate: "2026-05-05", startTime: "11:00" }),
        "staleLifetime",
      )[0]?.suggestedFixes,
    ).toEqual(fixes);
  });
});

function run(fixes: SuggestedFix[], current: PlanDecisionV1 | null, status = "applied") {
  const friction: FrictionPoint = {
    id: "friction",
    userId: "user",
    severity: "warning",
    title: "Conflict",
    message: "Conflict",
    affectedBlockIds: ["a", "b"],
    suggestedFixes: fixes,
    canIgnore: true,
    ignored: false,
    resolved: false,
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  };
  return classifySuggestedFixes({
    frictionPoints: [friction],
    generatedWorkBlocks: [],
    blockCandidates: [block("a"), block("b")].map(toCandidate),
    scheduledBlocks: [block("a"), block("b")],
    unplacedCandidates: [],
    decisions: current ? [current] : [],
    replayResults: current
      ? [
          {
            decisionId: current.id,
            kind: current.kind,
            target: current.target,
            status,
            ...(status === "blocked" ? { reason: "exactPlacementUnavailable" } : {}),
          } as never,
        ]
      : [],
    authoredSetup: authored(),
    dayBoundaryStartTime: "03:00",
    classifiedAt: "2026-05-01T00:00:00Z",
  });
}
function fix(action: SuggestedFix["action"], id: string): SuggestedFix {
  const prefix =
    action === "moveBlock"
      ? "fix_move_"
      : action === "skipBlock"
        ? "fix_skip_"
        : action === "convertToRecovery"
          ? "fix_convert_"
          : "fix_reduce_";
  return { id: `${prefix}${id}`, label: `${action} ${id}`, action };
}
function block(id: "a" | "b"): DraftScheduledBlock {
  return {
    id,
    occurrenceIdentity: {
      version: 1,
      sourceKind: "template",
      frequency: "daily",
      templateId: `template_${id}`,
      recurrenceId: `recurrence_${id}`,
      scopeKind: "userDay",
      userDayDate: "2026-05-05",
      slot: 0,
    },
    userId: "user",
    templateId: `template_${id}`,
    source: "template",
    title: id.toUpperCase(),
    category: "fitness",
    placementType: "flexible",
    startsAt: new Date(2026, 4, 5, 9),
    endsAt: new Date(2026, 4, 5, 10),
    userDayDate: "2026-05-05",
    userWeekStartDate: "2026-05-03",
    priority: id === "a" ? 2 : 3,
    status: "planned",
    externalResources: [],
  };
}
function toCandidate(value: DraftScheduledBlock): BlockCandidate {
  return {
    ...value,
    templateId: value.templateId!,
    placementType: value.placementType ?? "flexible",
    recurrenceId: `recurrence_${value.id}`,
    recurrenceFrequency: "daily" as const,
    durationMinutes: 60,
    preferredWindow: "anyAvailable" as const,
    rescheduleBehavior: "askUser" as const,
  };
}
function decision(kind: PlanDecisionV1["kind"], payload: object): PlanDecisionV1 {
  const reference = createDurableOccurrenceReference(block("a").occurrenceIdentity!, authored());
  if (reference.status !== "created") throw new Error("reference failed");
  return {
    version: 1,
    id: "00000000-0000-4000-8000-000000000001",
    kind,
    target: reference.reference,
    payload,
    acceptedAt: "2026-05-01T00:00:00Z",
    provenance: { source: "user" },
  } as unknown as PlanDecisionV1;
}
function authored(): DayFrameAuthoredSetup {
  const source = (id: "a" | "b") => ({
    id: `template_${id}`,
    incarnationId: `00000000-0000-4000-8000-00000000001${id === "a" ? "1" : "3"}`,
    userId: "user",
    title: id.toUpperCase(),
    category: "fitness",
    placementType: "flexible",
    durationMinutes: 60,
    priority: id === "a" ? 2 : 3,
    preferredWindow: "anyAvailable",
    rescheduleBehavior: "askUser",
    requiresResource: false,
    externalResources: [],
    enabled: true,
    createdAt: "2026-05-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  });
  return {
    schedulingPreferences: { dayBoundaryStartTime: "03:00", weekStartsOn: "sunday" },
    previewRange: { preset: "oneWeek", startDate: "2026-05-05", endDate: "2026-05-11" },
    shiftDefinitions: [],
    shiftCycles: [],
    blockTemplates: [source("a"), source("b")],
    blockRecurrences: ["a", "b"].map((id, index) => ({
      id: `recurrence_${id}`,
      incarnationId: `00000000-0000-4000-8000-00000000001${index ? "4" : "2"}`,
      blockTemplateId: `template_${id}`,
      frequency: "daily",
    })),
    manualEvents: [],
  } as unknown as DayFrameAuthoredSetup;
}
