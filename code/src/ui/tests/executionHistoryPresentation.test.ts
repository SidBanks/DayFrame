import { describe, expect, it } from "vitest";
import type { ExecutionRecordV1 } from "../../core/execution/executionRecord.js";
import {
  buildExecutionHistoryItems,
  orderSubjectChain,
} from "../../core/execution/executionHistoryProjection.js";
import { buildExecutionCorrectionInput } from "../executionReportingWorkflow.js";

const snapshot = (date: string, title: string) =>
  ({
    sourceFamily: "unplanned",
    title,
    category: "optional",
    userDay: { date, dayBoundaryStartTime: "03:00", utcOffsetMinutes: -300 },
    plan: { state: "unplanned" },
  }) as unknown as import("../../core/execution/executionRecord.js").ExecutionHistoricalSnapshot;
const id = (tail: string) => `00000000-0000-4000-8000-${tail}`;
function assertion(input: {
  record: string;
  subject: string;
  date: string;
  title: string;
  outcome?: "completed" | "partial";
  replaces?: string;
}): ExecutionRecordV1 {
  return {
    version: 1,
    id: id(input.record),
    subjectId: id(input.subject),
    kind: "assertion",
    provenance: { kind: "userReported" },
    recordedAt: `2026-08-${input.record.slice(-2)}T12:00:00.000Z`,
    subject: { kind: "unplanned" },
    snapshot: snapshot(input.date, input.title),
    outcome: input.outcome ?? "completed",
    ...(input.replaces ? { replacesRecordId: id(input.replaces) } : {}),
  } as unknown as ExecutionRecordV1;
}
function retraction(record: string, subject: string, replaces: string): ExecutionRecordV1 {
  return {
    version: 1,
    id: id(record),
    subjectId: id(subject),
    kind: "retraction",
    provenance: { kind: "userReported" },
    recordedAt: "2026-08-23T12:00:00.000Z",
    replacesRecordId: id(replaces),
  } as unknown as ExecutionRecordV1;
}

describe("execution history presentation", () => {
  it("projects one current item per subject and orders by frozen user-day", () => {
    const first = assertion({
      record: "000000000001",
      subject: "000000000011",
      date: "2026-08-20",
      title: "Older",
    });
    const second = assertion({
      record: "000000000002",
      subject: "000000000012",
      date: "2026-08-22",
      title: "Newer",
      outcome: "partial",
    });
    const correction = assertion({
      record: "000000000003",
      subject: "000000000011",
      date: "2026-08-20",
      title: "Older",
      outcome: "partial",
      replaces: "000000000001",
    });
    const items = buildExecutionHistoryItems([correction, second, first]);
    expect(
      items.map((item) => [item.snapshot.title, item.currentOutcome.status, item.revisions.length]),
    ).toEqual([
      ["Newer", "partial", 1],
      ["Older", "partial", 2],
    ]);
  });

  it("uses chain topology rather than array order and retains snapshot after retraction", () => {
    const root = assertion({
      record: "000000000001",
      subject: "000000000011",
      date: "2026-08-20",
      title: "Deleted source",
    });
    const correction = assertion({
      record: "000000000002",
      subject: "000000000011",
      date: "2026-08-20",
      title: "Deleted source",
      outcome: "partial",
      replaces: "000000000001",
    });
    const withdrawn = retraction("000000000003", "000000000011", "000000000002");
    expect(orderSubjectChain([withdrawn, root, correction]).map((record) => record.id)).toEqual([
      root.id,
      correction.id,
      withdrawn.id,
    ]);
    const [item] = buildExecutionHistoryItems([withdrawn, root, correction]);
    expect(item).toMatchObject({
      currentOutcome: { status: "unknown" },
      snapshot: { title: "Deleted source" },
      revisions: [{ kind: "assertion" }, { kind: "assertion" }, { kind: "retraction" }],
    });
  });

  it("returns clone-isolated presentation objects", () => {
    const record = assertion({
      record: "000000000001",
      subject: "000000000011",
      date: "2026-08-20",
      title: "Original",
    });
    const [item] = buildExecutionHistoryItems([record]);
    item!.snapshot.title = "Changed";
    expect(record.kind === "assertion" && record.snapshot.title).toBe("Original");
  });

  it("reuses reporting validation and rejects Skip for unplanned correction", () => {
    const result = buildExecutionCorrectionInput(
      snapshot("2026-08-20", "Unplanned"),
      { kind: "unplanned" },
      { outcome: "skipped", occurredAtLocal: "", durationMinutes: "", note: "" },
    );
    expect(result).toEqual({
      status: "invalid",
      message: "Skip is available only for planned activities.",
    });
  });
});
