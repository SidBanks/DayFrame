import type { ExecutionReportedOutcome, CreateExecutionAssertionInput } from "../core/execution/executionRecord.js";
import type { HistoricalExecutionTarget } from "../core/execution/historicalExecutionTarget.js";

export type ExecutionReportDraft = {
  outcome: ExecutionReportedOutcome;
  occurredAtLocal: string;
  durationMinutes: string;
  note: string;
};

export type ExecutionReportInputResult =
  | { status: "valid"; input: CreateExecutionAssertionInput }
  | { status: "invalid"; message: string };

export function buildExecutionReportInput(
  target: HistoricalExecutionTarget,
  draft: ExecutionReportDraft,
): ExecutionReportInputResult {
  return buildInput(target.snapshot, { kind: "planned", reference: target.reference }, draft);
}

function buildInput(snapshot: HistoricalExecutionTarget["snapshot"], subject: CreateExecutionAssertionInput["subject"],
  draft: ExecutionReportDraft): ExecutionReportInputResult {
  const note = draft.note.trim();
  if (note.length > 2000) return { status: "invalid", message: "Note must be 2,000 characters or fewer." };
  if (draft.outcome === "skipped" && (draft.occurredAtLocal || draft.durationMinutes)) {
    return { status: "invalid", message: "Skip cannot include an actual time or duration." };
  }
  let occurredAt: string | undefined;
  if (draft.occurredAtLocal) {
    const parsed = new Date(draft.occurredAtLocal);
    if (Number.isNaN(parsed.getTime())) return { status: "invalid", message: "Enter a valid actual date and time." };
    occurredAt = parsed.toISOString();
  }
  let durationMinutes: number | undefined;
  if (draft.durationMinutes) {
    durationMinutes = Number(draft.durationMinutes);
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1 || durationMinutes > 1440) {
      return { status: "invalid", message: "Duration must be a whole number from 1 to 1,440 minutes." };
    }
  }
  const actualTime = occurredAt || durationMinutes
    ? { ...(occurredAt ? { occurredAt } : {}), ...(durationMinutes ? { durationMinutes } : {}) }
    : undefined;
  return { status: "valid", input: {
    subject: structuredClone(subject), snapshot: structuredClone(snapshot), outcome: draft.outcome,
    ...(actualTime ? { actualTime } : {}), ...(note ? { note } : {}),
  } };
}

export function buildExecutionCorrectionInput(
  snapshot: HistoricalExecutionTarget["snapshot"],
  subject: CreateExecutionAssertionInput["subject"],
  draft: ExecutionReportDraft,
): ExecutionReportInputResult {
  if (subject.kind === "unplanned" && draft.outcome === "skipped") {
    return { status: "invalid", message: "Skip is available only for planned activities." };
  }
  return buildInput(snapshot, subject, draft);
}

export function executionTargetsEqual(left: HistoricalExecutionTarget, right: HistoricalExecutionTarget): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
