import type {
  GoalFeasibilityResultV1,
  FeasibilityReasonV1,
} from "../core/planning/goalFeasibility.js";
import type { RealizationReasonCodeV1 } from "../core/planning/acceptedAllocationRealization.js";
import type { NoProposalV1 } from "../core/planning/proposal.js";

export const feasibilityLabels: Record<GoalFeasibilityResultV1["classification"], string> = {
  feasible: "This effort can fit.",
  partiallyFeasible: "Part of this effort can fit.",
  infeasible: "This effort cannot currently fit.",
  structurallyIneligible: "A Goal prerequisite prevents planning this work.",
  conditionallyEligible: "Planning depends on an unresolved Goal condition.",
  unknown: "DayFrame does not yet know enough to evaluate this effort.",
  stale: "The schedule has changed. Refresh it before evaluating again.",
  unavailableCoverage: "The schedule does not fully cover this planning period.",
};
export const feasibilityReasons: Record<FeasibilityReasonV1["code"], string> = {
  insufficientTotalDuration: "There is not enough usable time in this period.",
  insufficientContiguousDuration: "No uninterrupted opening is long enough for a session.",
  sessionCountMismatch: "The required number of sessions cannot fit.",
  partialBelowMinimum: "The available effort is below your minimum acceptable amount.",
  structurallyIneligible: "Complete the Goal's prerequisite before planning this work.",
  conditionalStructuralEligibility: "A Goal dependency still needs attention.",
  staleCapacity: "Available-time information is out of date. Refresh the schedule.",
  incompleteCapacityCoverage: "Generate a schedule covering the whole requested period.",
  unresolvedCapacityLiability:
    "Unplaced or accepted unscheduled work qualifies the available time.",
  sleepFoundationNonAllocatable: "Required Sleep must be resolved before planning this effort.",
  capacityUnavailable: "Available time cannot currently be established.",
  demandInapplicable: "This planning intent or Goal is not active.",
  footprintUnspecified: "Choose whether sessions need support or protected time.",
  footprintAssociationAmbiguous:
    "More than one resource choice applies. Review the planning intent.",
  footprintRevisionMissing: "The saved resource choice is unavailable. Save a current choice.",
  footprintCoverageIncomplete: "The full session, support and protected time must be covered.",
  requiredSupportUnavailable: "Required support activity cannot fit.",
  requiredBufferUnavailable: "Required protected time cannot fit.",
  componentCrossesUserDay: "A session resource crosses an unsupported day boundary.",
  resourceConflict: "The required session resources conflict.",
};
export const noProposalReasons: Record<NoProposalV1["reasons"][number]["code"], string> = {
  noCapacity: "No usable time remains for a proposal.",
  noUnmetDemand: "There is no remaining planning effort to propose.",
  allSatisfied: "The evaluated effort is already satisfied.",
  noMinimumFit: "No option meets the minimum session requirements.",
  compositionInfeasible: "The required support and protected time cannot fit.",
  structurallyBlocked: "Goal prerequisites prevent a proposal.",
  policyAbstained: "The current planning policy cannot offer an option.",
  incompleteInput: "Planning information is incomplete or out of date.",
};
export const realizationReasons: Record<RealizationReasonCodeV1, string> = {
  sourceUnavailable:
    "Current scheduling evidence is unavailable. Refresh and review before retrying.",
  sourceChanged: "Saved scheduling information changed. Review it before retrying.",
  realizationBusy: "Another scheduling operation is finishing. Try again after it settles.",
  replacementBusy: "Clear or restore is in progress. Wait for it to finish.",
  contextReplaced: "This result belongs to an earlier state. Review the current state.",
  authorityUnavailable: "Scheduling authority is not available yet.",
  authorityProtected: "Scheduling authority is protected. Its evidence has been preserved.",
  commitStateUncertain:
    "Scheduling may have been saved, but its outcome is unconfirmed. Do not retry while authority is protected.",
  verificationFailedAfterCommit:
    "The write completed, but its complete scheduling evidence could not be verified. Authority is protected.",
  sleepFoundationReviewRequired:
    "Required Sleep has changed or is unresolved. Review this accepted work before scheduling it.",
  alreadyRealized: "This accepted work is already scheduled.",
  acceptedAllocationIncomplete: "This older acceptance lacks the resources needed for scheduling.",
  acceptedAllocationInvalid:
    "The accepted work could not be validated. Its authority has been preserved.",
  claimGeometryMismatch: "The accepted time no longer matches its resource footprint.",
  claimIdentityMismatch: "The accepted resource identity could not be validated.",
  scheduleConflict:
    "Accepted work conflicts with the current schedule. Resolve the conflict and retry.",
  atomicPersistenceFailure: "Scheduling could not be saved. Check local storage and retry.",
};
export function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60),
    rest = minutes % 60;
  return [hours ? `${hours}h` : "", rest || !hours ? `${rest}m` : ""].filter(Boolean).join(" ");
}
