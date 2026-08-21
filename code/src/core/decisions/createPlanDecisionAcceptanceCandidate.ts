import type { DraftScheduledBlock, BlockCandidate, PriorityLevel } from "../blocks/types.js";
import type { GenerateSchedulePreviewResult } from "../engine/generateSchedulePreview.js";
import type { FrictionPoint, SuggestedFix } from "../friction/types.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import type { AcceptPlanDecisionInput } from "./planDecision.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";

export type PlanDecisionAcceptanceCandidateResult =
  | { status: "supported"; candidate: AcceptPlanDecisionInput }
  | { status: "unsupported"; reason: "unsupportedAction" | "unsupportedTargetFamily" }
  | { status: "unavailable"; reason: "ambiguousTarget" | "missingOccurrence" | "missingLineage" | "tryNotApplied" };

export function createPlanDecisionAcceptanceCandidate(input: {
  suggestedFix: SuggestedFix;
  frictionPoint: FrictionPoint;
  originalPreview: GenerateSchedulePreviewResult;
  revisedPreview: GenerateSchedulePreviewResult;
  authoredSetup: DayFrameAuthoredSetup;
}): PlanDecisionAcceptanceCandidateResult {
  if (!isSupportedAction(input.suggestedFix.action)) {
    return { status: "unsupported", reason: "unsupportedAction" };
  }
  const targetId = getTargetId(input.suggestedFix, input.frictionPoint);
  if (!targetId) return { status: "unavailable", reason: "ambiguousTarget" };
  const original = findBlock(input.originalPreview, targetId);
  if (!original?.occurrenceIdentity) return { status: "unavailable", reason: "missingOccurrence" };
  const constructed = createDurableOccurrenceReference(original.occurrenceIdentity, input.authoredSetup);
  if (constructed.status !== "created") return { status: "unavailable", reason: "missingLineage" };
  if (constructed.reference.sourceKind !== "template") {
    return { status: "unsupported", reason: "unsupportedTargetFamily" };
  }
  const provenance = { source: "suggestedFix" as const, suggestedAction: input.suggestedFix.action };
  if (input.suggestedFix.action === "skipBlock") {
    const revised = input.revisedPreview.scheduledBlocks.find((block) => block.id === targetId);
    const removedCandidate = !input.revisedPreview.unplacedCandidates.some((block) => block.id === targetId);
    if (revised?.status !== "skipped" && !(isCandidate(original) && removedCandidate)) {
      return { status: "unavailable", reason: "tryNotApplied" };
    }
    return { status: "supported", candidate: { kind: "omitOccurrence", target: constructed.reference, payload: {}, provenance } };
  }
  const revised = input.revisedPreview.scheduledBlocks.find((block) => block.id === targetId);
  if (!revised) return { status: "unavailable", reason: "tryNotApplied" };
  if (input.suggestedFix.action === "moveBlock") {
    if (isScheduled(original) && revised.startsAt.getTime() === original.startsAt.getTime()) {
      return { status: "unavailable", reason: "tryNotApplied" };
    }
    return { status: "supported", candidate: { kind: "placeOccurrence", target: constructed.reference,
      payload: { userDayDate: revised.userDayDate, startTime: localTime(revised.startsAt) }, provenance } };
  }
  if (input.suggestedFix.action === "reduceDuration") {
    const durationMinutes = Math.round((revised.endsAt.getTime() - revised.startsAt.getTime()) / 60_000);
    if (!isScheduled(original) || durationMinutes >= duration(original)) {
      return { status: "unavailable", reason: "tryNotApplied" };
    }
    return { status: "supported", candidate: { kind: "setOccurrenceDuration", target: constructed.reference,
      payload: { durationMinutes }, provenance } };
  }
  if (!isScheduled(original) || revised.priority === original.priority) {
    return { status: "unavailable", reason: "tryNotApplied" };
  }
  return { status: "supported", candidate: { kind: "setOccurrencePriority", target: constructed.reference,
    payload: { priority: revised.priority as PriorityLevel }, provenance } };
}

function isSupportedAction(action: SuggestedFix["action"]): action is "moveBlock" | "skipBlock" | "reduceDuration" | "changePriority" {
  return ["moveBlock", "skipBlock", "reduceDuration", "changePriority"].includes(action);
}
function getTargetId(fix: SuggestedFix, friction: FrictionPoint): string | null {
  const prefix = fix.action === "changePriority" ? "fix_change_priority_" :
    fix.action === "moveBlock" ? "fix_move_" : fix.action === "skipBlock" ? "fix_skip_" : "fix_reduce_";
  const encoded = fix.id.startsWith(prefix) ? fix.id.slice(prefix.length) : null;
  if (encoded && friction.affectedBlockIds.includes(encoded)) return encoded;
  return friction.affectedBlockIds.length === 1 ? friction.affectedBlockIds[0]! : null;
}
function findBlock(preview: GenerateSchedulePreviewResult, id: string): DraftScheduledBlock | BlockCandidate | undefined {
  return preview.scheduledBlocks.find((block) => block.id === id) ??
    preview.unplacedCandidates.find((block) => block.id === id) ?? preview.blockCandidates.find((block) => block.id === id);
}
function isScheduled(block: DraftScheduledBlock | BlockCandidate): block is DraftScheduledBlock { return "startsAt" in block; }
function isCandidate(block: DraftScheduledBlock | BlockCandidate): block is BlockCandidate { return !isScheduled(block); }
function duration(block: DraftScheduledBlock): number { return Math.round((block.endsAt.getTime() - block.startsAt.getTime()) / 60_000); }
function localTime(date: Date): `${number}:${number}` {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` as `${number}:${number}`;
}
