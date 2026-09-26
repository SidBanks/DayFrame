import type { RealizedScheduleFactV1 } from "../planning/realizedScheduleIdentity.js";
import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import type { LocalDateString } from "../shifts/types.js";
import type { PlanDecisionId } from "../decisions/planDecision.js";
import type { PlanDecisionReplayResult } from "../decisions/replayPlanDecisions.js";

export type FrictionSeverity = "info" | "warning" | "critical";

export type SuggestedFixAction =
  | "moveBlock"
  | "skipBlock"
  | "convertToRecovery"
  | "reduceDuration"
  | "changePriority"
  | "changeFixedTime"
  | "addResource"
  | "acceptConflict";

export type SuggestedFix = {
  id: string;
  label: string;
  action: SuggestedFixAction;
  parameters?: Record<string, string | number | boolean>;
  decisionContext?: SuggestedFixDecisionContext;
  sleepPlacement?: Extract<
    import("../decisions/planDecision.js").AcceptPlanDecisionInput,
    { kind: "placeSleepOccurrence" }
  >;
};

export type SuggestedFixDecisionContext = {
  relationship: "ordinary" | "preserving" | "unblocking" | "superseding" | "equivalent" | "unknown";
  decisionId?: PlanDecisionId;
  replayStatus?: PlanDecisionReplayResult["status"];
  explanationCode?: "sameTarget" | "exactEquivalent" | "blockedPlacement" | "constraintPreserved";
};

export type SuggestedFixFeedback = {
  message: string;
  tone: "info" | "warning";
};

export type FrictionPoint = {
  id: string;
  userId: string;
  kind?: "conflict" | "unplaced" | "workRequiredSkip" | "compositionFailure" | "sleep";
  sleepEvidence?:
    | {
        kind: "provenIncompatibility";
        conflicts: import("../sleep/sleepResolution.js").SleepFeasibilityConflictV1[];
        occurrences: import("../sleep/sleepResolution.js").SleepOccurrenceV1[];
        proofScope: import("../sleep/sleepResolution.js").SleepOwnerRange;
        dependencyFingerprint: string;
      }
    | {
        kind: "acceptedPlacementReview";
        dependencyFingerprint: string;
        reviews: import("../sleep/sleepPlacementAuthority.js").SleepPlacementReviewV1[];
        proofScope: import("../sleep/sleepResolution.js").SleepOwnerRange;
        underlyingStatus:
          | import("../sleep/sleepResolution.js").SleepResolutionV1["status"]
          | undefined;
      };
  severity: FrictionSeverity;
  title: string;
  message: string;
  affectedBlockIds: string[];
  affectedUserDayDate?: LocalDateString;
  affectedUserWeekStartDate?: LocalDateString;
  suggestedFixes: SuggestedFix[];
  canIgnore: boolean;
  ignored: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DetectScheduleFrictionInput = {
  generatedWorkBlocks: GeneratedWorkBlock[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  detectedAt: string;
};

export type DetectScheduleFrictionResult = {
  frictionPoints: FrictionPoint[];
};

export type GenerateSuggestedFixesInput = {
  frictionPoints: FrictionPoint[];
  generatedWorkBlocks: GeneratedWorkBlock[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  dayBoundaryStartTime?: `${number}:${number}`;
  getDayBoundaryStartTimeForUserDayDate?: (userDayDate: LocalDateString) => `${number}:${number}`;
  getUserDayWindowForUserDayDate?: (userDayDate: LocalDateString) => { start: Date; end: Date };
};

export type GenerateSuggestedFixesResult = {
  frictionPoints: FrictionPoint[];
};

export type ApplySuggestedFixInput = {
  realizedScheduleFacts?: readonly RealizedScheduleFactV1[];
  frictionPoints: FrictionPoint[];
  generatedWorkBlocks: GeneratedWorkBlock[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  selectedFrictionPointId: string;
  selectedSuggestedFixId: string;
  dayBoundaryStartTime: `${number}:${number}`;
  getUserDayWindowForUserDayDate?: (userDayDate: LocalDateString) => { start: Date; end: Date };
  revisedAt: string;
};

export type ApplySuggestedFixResult = {
  frictionPoints: FrictionPoint[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  actionFeedback?: SuggestedFixFeedback;
  didRevise: boolean;
};
