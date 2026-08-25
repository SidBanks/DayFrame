import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../authored/sourceIncarnation.js";
import type { PlanDecisionId } from "./planDecision.js";
import {
  getPlanDecisionTargetKey,
  planDecisionRecordsEqual,
  validatePlanDecision,
} from "./planDecision.js";
import type { DurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";

const incarnation = (n: number) =>
  `00000000-0000-4000-8000-${String(n).padStart(12, "0")}` as SourceIncarnationId;
const id = (n: number) =>
  `10000000-0000-4000-8000-${String(n).padStart(12, "0")}` as PlanDecisionId;
const target: DurableOccurrenceReference = {
  version: 1,
  sourceKind: "template",
  template: { id: "template", incarnationId: incarnation(1) },
  recurrence: { id: "recurrence", incarnationId: incarnation(2) },
  coordinate: { frequency: "daily", scopeKind: "userDay", userDayDate: "2026-08-20", slot: 0 },
};

describe("PlanDecision V1 domain", () => {
  it.each([
    ["placeOccurrence", { userDayDate: "2026-08-20", startTime: "09:30" }],
    ["omitOccurrence", {}],
    ["setOccurrenceDuration", { durationMinutes: 45 }],
    ["setOccurrencePriority", { priority: 1 }],
  ] as const)("validates and clones %s", (kind, payload) => {
    const raw = {
      version: 1,
      id: id(1),
      kind,
      target,
      payload,
      acceptedAt: "2026-08-20T12:00:00.000Z",
      provenance: { source: "user" },
    };
    const result = validatePlanDecision(raw);
    expect(result.status).toBe("valid");
    if (result.status === "valid") {
      expect(result.decision).toEqual(raw);
      expect(result.decision).not.toBe(raw);
      expect(result.decision.target).not.toBe(target);
    }
  });

  it("rejects extra/cross-kind fields, malformed values, and distinguishes future versions", () => {
    const base = {
      version: 1,
      id: id(1),
      kind: "omitOccurrence",
      target,
      payload: {},
      acceptedAt: "2026-08-20T12:00:00.000Z",
      provenance: { source: "user" },
    };
    expect(validatePlanDecision({ ...base, extra: true }).status).toBe("invalid");
    expect(validatePlanDecision({ ...base, payload: { priority: 1 } }).status).toBe("invalid");
    expect(validatePlanDecision({ ...base, version: 2 }).status).toBe("unsupportedVersion");
    expect(validatePlanDecision({ ...base, target: { ...target, version: 2 } }).status).toBe(
      "unsupportedTargetVersion",
    );
  });

  it("provides key-order-independent target keys and semantic equality", () => {
    const reordered = {
      coordinate: { slot: 0, userDayDate: "2026-08-20", scopeKind: "userDay", frequency: "daily" },
      recurrence: { incarnationId: incarnation(2), id: "recurrence" },
      template: { incarnationId: incarnation(1), id: "template" },
      sourceKind: "template",
      version: 1,
    } as DurableOccurrenceReference;
    expect(getPlanDecisionTargetKey(reordered)).toBe(getPlanDecisionTargetKey(target));
    const first = validatePlanDecision({
      version: 1,
      id: id(1),
      kind: "omitOccurrence",
      target,
      payload: {},
      acceptedAt: "2026-08-20T12:00:00.000Z",
      provenance: { source: "user" },
    });
    const second = validatePlanDecision({
      version: 1,
      id: id(1),
      kind: "omitOccurrence",
      target: reordered,
      payload: {},
      acceptedAt: "2026-08-20T12:00:00.000Z",
      provenance: { source: "user" },
    });
    if (first.status !== "valid" || second.status !== "valid") throw new Error("fixture invalid");
    expect(planDecisionRecordsEqual(first.decision, second.decision)).toBe(true);
  });
});
