import { describe, expect, it } from "vitest";
import type { HistoricalExecutionTarget } from "../../core/execution/historicalExecutionTarget.js";
import { buildExecutionReportInput, executionTargetsEqual } from "../executionReportingWorkflow.js";

const target = {
  reference: {
    version: 1,
    sourceKind: "template",
    template: {
      id: "template",
      incarnationId: "10000000-0000-4000-8000-000000000001",
    },
    coordinate: { scopeKind: "userDay", userDayDate: "2026-08-20", slot: 0 },
  },
  snapshot: {
    sourceFamily: "template",
    title: "Workout",
    category: "fitness",
    userDay: { date: "2026-08-20", dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
    plan: {
      state: "scheduled",
      startsAt: "2026-08-20T15:00:00.000Z",
      endsAt: "2026-08-20T16:00:00.000Z",
    },
  },
} as unknown as HistoricalExecutionTarget;

describe("execution reporting workflow", () => {
  it.each(["completed", "partial", "skipped"] as const)(
    "builds explicit %s input without infrastructure fields",
    (outcome) => {
      const result = buildExecutionReportInput(target, {
        outcome,
        occurredAtLocal: "",
        durationMinutes: "",
        note: "",
      });
      expect(result).toMatchObject({
        status: "valid",
        input: { outcome, subject: { kind: "planned" } },
      });
      expect(JSON.stringify(result)).not.toMatch(/recordedAt|subjectId|provenance|actualTime/);
    },
  );

  it("stores only user-supplied actual evidence and converts local datetime canonically", () => {
    const result = buildExecutionReportInput(target, {
      outcome: "completed",
      occurredAtLocal: "2026-08-20T12:30",
      durationMinutes: "45",
      note: "  felt good  ",
    });
    expect(result.status).toBe("valid");
    if (result.status === "valid")
      expect(result.input).toMatchObject({
        actualTime: {
          occurredAt: new Date("2026-08-20T12:30").toISOString(),
          durationMinutes: 45,
        },
        note: "felt good",
      });
  });

  it("forbids actual evidence for Skip", () => {
    expect(
      buildExecutionReportInput(target, {
        outcome: "skipped",
        occurredAtLocal: "",
        durationMinutes: "10",
        note: "",
      }),
    ).toEqual({ status: "invalid", message: "Skip cannot include an actual time or duration." });
  });

  it("enforces evidence and note bounds", () => {
    expect(
      buildExecutionReportInput(target, {
        outcome: "partial",
        occurredAtLocal: "",
        durationMinutes: "0",
        note: "",
      }).status,
    ).toBe("invalid");
    expect(
      buildExecutionReportInput(target, {
        outcome: "partial",
        occurredAtLocal: "",
        durationMinutes: "",
        note: "x".repeat(2001),
      }).status,
    ).toBe("invalid");
  });

  it("detects changed submission snapshots", () => {
    expect(executionTargetsEqual(target, structuredClone(target))).toBe(true);
    const changed = structuredClone(target);
    changed.snapshot.title = "Changed";
    expect(executionTargetsEqual(target, changed)).toBe(false);
  });
});
