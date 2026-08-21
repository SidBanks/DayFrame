import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import { createPlanDecisionAcceptanceCandidate } from "./createPlanDecisionAcceptanceCandidate.js";
import { getPlanDecisionTargetKey, type PlanDecisionV1 } from "./planDecision.js";
import type { PlanDecisionReplayResult } from "./replayPlanDecisions.js";
import { createDurableOccurrenceReference } from "../occurrences/durableOccurrenceReference.js";
import { applySuggestedFix } from "../friction/applySuggestedFix.js";
import type { FrictionPoint, SuggestedFix, SuggestedFixDecisionContext } from "../friction/types.js";
import type { GeneratedCycleWorkBlock } from "../cycles/types.js";
import type { TimeString } from "../time/types.js";
import type { DayFrameAuthoredSetup } from "../../state/types.js";

export function classifySuggestedFixes(input: {
  frictionPoints: readonly FrictionPoint[];
  generatedWorkBlocks: readonly GeneratedCycleWorkBlock[];
  blockCandidates: readonly BlockCandidate[];
  scheduledBlocks: readonly DraftScheduledBlock[];
  unplacedCandidates: readonly BlockCandidate[];
  decisions: readonly PlanDecisionV1[];
  replayResults: readonly PlanDecisionReplayResult[];
  authoredSetup: DayFrameAuthoredSetup;
  dayBoundaryStartTime: TimeString;
  classifiedAt: string;
}): FrictionPoint[] {
  if (input.decisions.length === 0) return input.frictionPoints.map(cloneFriction);
  const replayById = new Map(input.replayResults.map((result) => [result.decisionId, result]));
  const constraining = [...input.decisions].filter((decision) => {
    const status = replayById.get(decision.id)?.status;
    return status !== "staleSourceMissing" && status !== "staleLifetime" &&
      status !== "staleOccurrenceMissing" && status !== "outsideWindow";
  }).sort((left, right) => getPlanDecisionTargetKey(left.target).localeCompare(
    getPlanDecisionTargetKey(right.target)) || left.id.localeCompare(right.id));
  if (constraining.length === 0) return input.frictionPoints.map(cloneFriction);
  const runtimeTargetKeys = buildRuntimeTargetKeys(input, constraining);

  return input.frictionPoints.map((friction) => {
    const classified = friction.suggestedFixes.map((fix, index) => classifyFix({
      ...input, friction, fix, originalIndex: index, constraining, replayById, runtimeTargetKeys,
    })).filter((entry) => entry.context.relationship !== "equivalent");
    const blockedFriction = classified.some((entry) => entry.hasBlockedRelation);
    classified.sort((left, right) => rank(left.context.relationship, blockedFriction) -
      rank(right.context.relationship, blockedFriction) || left.originalIndex - right.originalIndex);
    return { ...friction, affectedBlockIds: [...friction.affectedBlockIds],
      suggestedFixes: classified.map(({ fix, context }) => ({ ...fix, decisionContext: context })) };
  });
}

function classifyFix(input: Parameters<typeof classifySuggestedFixes>[0] & {
  friction: FrictionPoint; fix: SuggestedFix; originalIndex: number;
  constraining: PlanDecisionV1[];
  replayById: Map<PlanDecisionV1["id"], PlanDecisionReplayResult>;
  runtimeTargetKeys: Map<string, string>;
}) {
  const prospective = prospectiveCandidate(input);
  if (prospective?.status === "supported") {
    const key = getPlanDecisionTargetKey(prospective.candidate.target);
    const current = input.constraining.find((decision) => getPlanDecisionTargetKey(decision.target) === key);
    if (current) {
      const equivalent = current.kind === prospective.candidate.kind &&
        JSON.stringify(current.payload) === JSON.stringify(prospective.candidate.payload);
      return result(input, equivalent ? "equivalent" : "superseding", current,
        equivalent ? "exactEquivalent" : "sameTarget", false);
    }
  }
  const targetId = getFixTargetId(input.fix, input.friction);
  const related = input.constraining.find((decision) => {
    const runtimeId = runtimeIdForDecision(decision, input.runtimeTargetKeys);
    return runtimeId !== undefined && runtimeId !== targetId && input.friction.affectedBlockIds.includes(runtimeId);
  });
  if (!related) return result(input, "ordinary", undefined, undefined, false);
  const replay = input.replayById.get(related.id);
  const directlyRelated = targetId !== null && input.friction.affectedBlockIds.includes(targetId);
  if (replay?.status === "blocked" && directlyRelated) {
    return result(input, "unblocking", related, "blockedPlacement", true);
  }
  if (replay?.status === "applied" && directlyRelated && isScheduleChanging(input.fix.action)) {
    return result(input, "preserving", related, "constraintPreserved", false);
  }
  return result(input, "unknown", related, undefined, false);
}

function prospectiveCandidate(input: Parameters<typeof classifyFix>[0]) {
  try {
    const applied = applySuggestedFix({ frictionPoints: input.frictionPoints.map(cloneFriction),
      generatedWorkBlocks: input.generatedWorkBlocks.map((value) => structuredClone(value)),
      scheduledBlocks: input.scheduledBlocks.map((value) => structuredClone(value)),
      unplacedCandidates: input.unplacedCandidates.map((value) => structuredClone(value)),
      selectedFrictionPointId: input.friction.id, selectedSuggestedFixId: input.fix.id,
      dayBoundaryStartTime: input.dayBoundaryStartTime, revisedAt: input.classifiedAt });
    return createPlanDecisionAcceptanceCandidate({ suggestedFix: input.fix, frictionPoint: input.friction,
      originalPreview: preview(input, input.scheduledBlocks, input.unplacedCandidates),
      revisedPreview: preview(input, applied.scheduledBlocks, applied.unplacedCandidates),
      authoredSetup: input.authoredSetup });
  } catch { return null; }
}

function preview(input: Parameters<typeof classifyFix>[0], scheduledBlocks: readonly DraftScheduledBlock[],
  unplacedCandidates: readonly BlockCandidate[]) {
  return { generatedWorkBlocks: [...input.generatedWorkBlocks], blockCandidates: [...input.blockCandidates],
    scheduledBlocks: [...scheduledBlocks], unplacedCandidates: [...unplacedCandidates],
    frictionPoints: [...input.frictionPoints], planDecisionResults: [...input.replayResults] };
}

function result(input: Parameters<typeof classifyFix>[0], relationship: SuggestedFixDecisionContext["relationship"],
  decision: PlanDecisionV1 | undefined, explanationCode: SuggestedFixDecisionContext["explanationCode"] | undefined,
  hasBlockedRelation: boolean) {
  const replay = decision ? input.replayById.get(decision.id) : undefined;
  const context: SuggestedFixDecisionContext = { relationship,
    ...(decision ? { decisionId: decision.id } : {}), ...(replay ? { replayStatus: replay.status } : {}),
    ...(explanationCode ? { explanationCode } : {}) };
  return { fix: { ...input.fix }, context, originalIndex: input.originalIndex, hasBlockedRelation };
}

function buildRuntimeTargetKeys(input: Parameters<typeof classifySuggestedFixes>[0], decisions: PlanDecisionV1[]) {
  const wanted = new Set(decisions.map((decision) => getPlanDecisionTargetKey(decision.target)));
  const map = new Map<string, string>();
  for (const block of [...input.scheduledBlocks, ...input.unplacedCandidates, ...input.blockCandidates]) {
    if (!block.occurrenceIdentity) continue;
    const reference = createDurableOccurrenceReference(block.occurrenceIdentity, input.authoredSetup);
    if (reference.status !== "created") continue;
    const key = getPlanDecisionTargetKey(reference.reference);
    if (wanted.has(key)) map.set(key, block.id);
  }
  return map;
}
function runtimeIdForDecision(decision: PlanDecisionV1, map: Map<string, string>) {
  return map.get(getPlanDecisionTargetKey(decision.target));
}
function getFixTargetId(fix: SuggestedFix, friction: FrictionPoint): string | null {
  const prefixes = ["fix_change_priority_", "fix_change_fixed_time_", "fix_move_", "fix_skip_", "fix_reduce_", "fix_convert_"];
  for (const prefix of prefixes) if (fix.id.startsWith(prefix)) {
    const id = fix.id.slice(prefix.length); if (friction.affectedBlockIds.includes(id)) return id;
  }
  return friction.affectedBlockIds.length === 1 ? friction.affectedBlockIds[0]! : null;
}
function rank(value: SuggestedFixDecisionContext["relationship"], blocked: boolean) {
  const tiers = blocked ? { unblocking: 0, preserving: 1, ordinary: 2, unknown: 2, superseding: 3, equivalent: 4 }
    : { preserving: 0, unblocking: 1, ordinary: 2, unknown: 2, superseding: 3, equivalent: 4 };
  return tiers[value];
}
function isScheduleChanging(action: SuggestedFix["action"]) {
  return action === "moveBlock" || action === "skipBlock" || action === "reduceDuration" || action === "changePriority";
}
function cloneFriction(value: FrictionPoint): FrictionPoint {
  return { ...value, affectedBlockIds: [...value.affectedBlockIds],
    suggestedFixes: value.suggestedFixes.map((fix) => ({ ...fix,
      ...(fix.parameters ? { parameters: { ...fix.parameters } } : {}),
      ...(fix.decisionContext ? { decisionContext: { ...fix.decisionContext } } : {}) })) };
}
