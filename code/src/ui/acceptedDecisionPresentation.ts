import { getPlanDecisionTargetKey, type PlanDecisionId, type PlanDecisionV1 } from "../core/decisions/planDecision.js";
import type { PlanDecisionReplayResult } from "../core/decisions/replayPlanDecisions.js";
import type { DayFramePreview, DayFrameState } from "../state/types.js";

export type AcceptedDecisionStatus =
  | "applied" | "blocked" | "outsideWindow" | "staleSourceMissing" | "staleLifetime"
  | "staleOccurrenceMissing" | "inapplicable" | "unableToEvaluate" | "notEvaluated"
  | "regenerateToEvaluate";

export type AcceptedDecisionViewModel = {
  decisionId: PlanDecisionId;
  summary: string;
  targetSummary: string;
  occurrenceContext: string;
  status: AcceptedDecisionStatus;
  statusLabel: string;
};

export function buildAcceptedDecisionViewModels(input: {
  decisions: readonly PlanDecisionV1[];
  preview: DayFramePreview | null;
  authoredSetup: Pick<DayFrameState, "blockTemplates" | "manualEvents" | "shiftDefinitions">;
}): AcceptedDecisionViewModel[] {
  const replayById = input.preview && !input.preview.isStale
    ? new Map(input.preview.result.planDecisionResults.map((result) => [result.decisionId, result]))
    : new Map<PlanDecisionId, PlanDecisionReplayResult>();
  return [...input.decisions]
    .sort((left, right) => getPlanDecisionTargetKey(left.target).localeCompare(
      getPlanDecisionTargetKey(right.target)) || left.id.localeCompare(right.id))
    .map((decision) => {
      const targetSummary = targetLabel(decision, input.authoredSetup);
      const status = input.preview === null ? "notEvaluated" : input.preview.isStale
        ? "regenerateToEvaluate" : toStatus(replayById.get(decision.id));
      return { decisionId: decision.id, targetSummary, occurrenceContext: occurrenceContext(decision),
        summary: semanticSummary(decision, targetSummary), status, statusLabel: statusCopy(status) };
    });
}

function targetLabel(decision: PlanDecisionV1, state: Pick<DayFrameState,
  "blockTemplates" | "manualEvents" | "shiftDefinitions">): string {
  const target = decision.target;
  if (target.sourceKind === "template") {
    const source = state.blockTemplates.find((item) => item.id === target.template.id &&
      item.incarnationId === target.template.incarnationId);
    return source?.title ?? "previous template occurrence";
  }
  if (target.sourceKind === "manualEvent") {
    const source = state.manualEvents.find((item) => item.id === target.manualEvent.id &&
      item.incarnationId === target.manualEvent.incarnationId);
    return source?.title ?? "previous manual event";
  }
  const source = state.shiftDefinitions.find((item) => item.id === target.shiftDefinition.id &&
    item.incarnationId === target.shiftDefinition.incarnationId);
  return source?.name ?? "previous work occurrence";
}

function semanticSummary(decision: PlanDecisionV1, target: string): string {
  switch (decision.kind) {
    case "placeOccurrence": return `Place ${target} on ${decision.payload.userDayDate} at ${formatTime(decision.payload.startTime)}`;
    case "omitOccurrence": return `Omit ${target}`;
    case "setOccurrenceDuration": return `Use ${decision.payload.durationMinutes} minutes for ${target}`;
    case "setOccurrencePriority": return `Use priority ${decision.payload.priority} for ${target}`;
  }
}

function occurrenceContext(decision: PlanDecisionV1): string {
  const target = decision.target;
  if (target.sourceKind === "manualEvent") return "Manual event";
  if (target.sourceKind === "work") return `Work occurrence on ${target.coordinate.localStartDate}`;
  const coordinate = target.coordinate;
  return coordinate.scopeKind === "userDay"
    ? `Occurrence on ${coordinate.userDayDate}${coordinate.slot ? `, slot ${coordinate.slot + 1}` : ""}`
    : `Occurrence in week of ${coordinate.userWeekStartDate}, slot ${coordinate.slot + 1}`;
}

function toStatus(result: PlanDecisionReplayResult | undefined): AcceptedDecisionStatus {
  if (!result) return "unableToEvaluate";
  switch (result.status) {
    case "applied": case "blocked": case "outsideWindow": case "staleSourceMissing":
    case "staleLifetime": case "staleOccurrenceMissing": return result.status;
    case "inapplicable": return "inapplicable";
    case "invalid": case "unsupported": return "unableToEvaluate";
  }
}

function statusCopy(status: AcceptedDecisionStatus): string {
  switch (status) {
    case "applied": return "Applied";
    case "blocked": return "Blocked — the accepted choice could not be applied in this schedule";
    case "outsideWindow": return "Outside this preview";
    case "staleSourceMissing": return "Stale — the original source is no longer present";
    case "staleLifetime": return "Stale — this choice no longer matches the current source lifetime";
    case "staleOccurrenceMissing": return "Stale — this occurrence is not currently generated";
    case "inapplicable": return "Not currently applicable";
    case "notEvaluated": return "Generate a preview to evaluate this choice";
    case "regenerateToEvaluate": return "Regenerate to evaluate this choice";
    case "unableToEvaluate": return "Unable to evaluate";
  }
}

function formatTime(value: string): string {
  const [hourValue, minute = "00"] = value.split(":");
  const hour = Number(hourValue);
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? "AM" : "PM"}`;
}
