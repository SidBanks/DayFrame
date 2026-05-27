import type { BlockCandidate, DraftScheduledBlock } from "../blocks/types.js";
import type { GeneratedWorkBlock } from "../shifts/types.js";
import type { LocalDateString } from "../shifts/types.js";

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
};

export type SuggestedFixFeedback = {
  message: string;
  tone: "info" | "warning";
};

export type FrictionPoint = {
  id: string;
  userId: string;
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
};

export type GenerateSuggestedFixesResult = {
  frictionPoints: FrictionPoint[];
};

export type ApplySuggestedFixInput = {
  frictionPoints: FrictionPoint[];
  generatedWorkBlocks: GeneratedWorkBlock[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  selectedFrictionPointId: string;
  selectedSuggestedFixId: string;
  dayBoundaryStartTime: `${number}:${number}`;
  revisedAt: string;
};

export type ApplySuggestedFixResult = {
  frictionPoints: FrictionPoint[];
  scheduledBlocks: DraftScheduledBlock[];
  unplacedCandidates: BlockCandidate[];
  actionFeedback?: SuggestedFixFeedback;
  didRevise: boolean;
};
