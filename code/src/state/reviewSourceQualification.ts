import type { DayFrameState, DayFrameAuthoredSetup } from "./types.js";
import type { GoalV1 } from "../core/goals/goal.js";
import type { SleepFoundationAuthority } from "../core/sleep/sleepFoundationalOccupancy.js";
import type { ProposalSurface } from "./proposalSurface.js";
import type { RealizationSurface } from "./realizationSurface.js";
import type { CompositionSurface } from "./compositionSurface.js";
import type { GoalSurface } from "./goalSurface.js";
import type { PlanDecisionSurface } from "./planDecisionSurface.js";
import type { HistoricalPlanSurface, PublicationOrigin } from "./historicalPlanSurface.js";
import type { SourceObservation } from "./sourceObservation.js";

export const publicationSources = [
  "proposal",
  "realization",
  "activeSetup",
  "planDecision",
  "composition",
  "goal",
  "sleepFoundation",
  "historicalPlan",
] as const;
export type PublicationSource = (typeof publicationSources)[number];
export type QualificationReason =
  | "initializing"
  | "readUnavailable"
  | "protected"
  | "writeInProgress"
  | "commitUnconfirmed"
  | "verificationFailed"
  | "coverageIncomplete"
  | "pendingDurability"
  | "qualificationUnavailable";
export type Coverage =
  | { status: "complete"; basis: "wholeAuthority" | "canonicalRange" }
  | { status: "partial" | "unknown"; basis: "wholeAuthority" };
export type PublicationSourceIssue = Readonly<{
  source: PublicationSource;
  reason: QualificationReason;
  ownerReason?: string;
  coverage: Coverage;
}>;
export type SourceQualification =
  | {
      status: "qualified";
      coverage: Extract<Coverage, { status: "complete" }>;
      basis: "verifiedCommitted" | "qualifiedPriorCommit" | "currentRuntime";
      lastWrite: "none" | "verified" | "knownNotWritten" | "runtimeAcceptedPending";
    }
  | { status: "unqualified"; issue: PublicationSourceIssue };
export type SourceQualifications = Readonly<Record<PublicationSource, SourceQualification>>;
export type PublicationSourceFailure = {
  reason: "publicationSourceUnqualified";
  sourceIssues: readonly [PublicationSourceIssue, ...PublicationSourceIssue[]];
};
export type PublicationSourceCheck =
  | { status: "current" }
  | { status: "rejected"; reason: "contextReplaced" | "sourceChanged" }
  | ({ status: "rejected" } & PublicationSourceFailure);
export type ReviewRequired = {
  reviewRequired?: true;
  sourceIssues?: readonly PublicationSourceIssue[];
};
export type QualifiedFamily<T> = {
  records: T[];
  coverage: Coverage;
  availability: "available" | "unavailable" | "protected" | "unsettled";
};
export const qualified = (
  basis: Extract<SourceQualification, { status: "qualified" }>["basis"] = "currentRuntime",
  lastWrite: Extract<SourceQualification, { status: "qualified" }>["lastWrite"] = "none",
): SourceQualification => ({
  status: "qualified",
  coverage: { status: "complete", basis: "wholeAuthority" },
  basis,
  lastWrite,
});
export const unqualified = (
  source: PublicationSource,
  reason: QualificationReason,
  ownerReason?: string,
  partial = false,
): SourceQualification => ({
  status: "unqualified",
  issue: {
    source,
    reason,
    ...(ownerReason ? { ownerReason } : {}),
    coverage: { status: partial ? "partial" : "unknown", basis: "wholeAuthority" },
  },
});
export function sourceIssues(
  qualification: SourceQualifications,
  includeHistory = false,
): PublicationSourceIssue[] {
  return publicationSources.flatMap((source) => {
    const value = qualification[source];
    if (
      value.status === "unqualified" &&
      value.issue.source !== source &&
      qualification[value.issue.source].status === "unqualified"
    )
      return [];
    return (includeHistory || source !== "historicalPlan") && value.status === "unqualified"
      ? [value.issue]
      : [];
  });
}
export function qualificationFailure(
  qualification: SourceQualifications,
): Extract<PublicationSourceCheck, { reason: "publicationSourceUnqualified" }> | undefined {
  const [first, ...rest] = sourceIssues(qualification);
  return first
    ? { status: "rejected", reason: "publicationSourceUnqualified", sourceIssues: [first, ...rest] }
    : undefined;
}
export function qualifiedFamily<T>(
  records: T[],
  qualification: SourceQualification,
): QualifiedFamily<T> {
  if (qualification.status === "qualified")
    return { records, coverage: qualification.coverage, availability: "available" };
  const { reason, coverage } = qualification.issue;
  return {
    records,
    coverage,
    availability: ["protected", "commitUnconfirmed", "verificationFailed"].includes(reason)
      ? "protected"
      : reason === "writeInProgress"
        ? "unsettled"
        : "unavailable",
  };
}
type Ingress = { status: string; reason?: string; quarantinedEntryCount?: number };
export function runtimeQualification(
  source: PublicationSource,
  ingress: Ingress,
  durability?: string,
): SourceQualification {
  if (ingress.status === "protected" || ingress.status === "recoveryRequired")
    return unqualified(source, "protected", ingress.reason, true);
  if (ingress.status === "initializing") return unqualified(source, "initializing");
  if (ingress.status === "noSource" && ingress.reason === "storageUnavailable")
    return unqualified(source, "readUnavailable", ingress.reason);
  if (ingress.quarantinedEntryCount)
    return unqualified(source, "coverageIncomplete", undefined, true);
  if (
    ingress.status === "accepted" ||
    (ingress.status === "noSource" &&
      ["missing", "resolvedByAbandonment"].includes(ingress.reason ?? ""))
  )
    return qualified(
      "currentRuntime",
      durability && durability !== "durable" ? "runtimeAcceptedPending" : "none",
    );
  return unqualified(source, "qualificationUnavailable");
}
export function proposalQualification(
  ingress: Ingress,
  durability: string,
  evidence: {
    active: boolean;
    provenPriorCommit: boolean;
    protectionCause?: "commitUnconfirmed" | "verificationFailed" | undefined;
  },
): SourceQualification {
  if (ingress.status === "protected")
    return unqualified("proposal", evidence.protectionCause ?? "protected", ingress.reason, true);
  if (evidence.active) return unqualified("proposal", "writeInProgress", undefined, true);
  if (ingress.status === "initializing") return unqualified("proposal", "initializing");
  if (ingress.status === "accepted" && evidence.provenPriorCommit) {
    if (durability === "durable") return qualified("verifiedCommitted", "verified");
    if (durability === "storageFailure")
      return qualified("qualifiedPriorCommit", "knownNotWritten");
  }
  return unqualified(
    "proposal",
    durability === "pending" ? "pendingDurability" : "qualificationUnavailable",
    undefined,
    true,
  );
}
export function historyQualification(
  status: ReturnType<HistoricalPlanSurface["getStatus"]>,
): SourceQualification {
  if (status.status === "protected")
    return unqualified("historicalPlan", "protected", status.reason);
  if (status.status === "unavailable")
    return unqualified("historicalPlan", "readUnavailable", status.error.code);
  if (status.status === "initializing") return unqualified("historicalPlan", "initializing");
  return qualified("verifiedCommitted", "verified");
}
export type ReviewSourceSnapshot = {
  state: DayFrameState;
  setup: DayFrameAuthoredSetup;
  goals: GoalV1[];
  sleep: SleepFoundationAuthority;
  proposals: ReturnType<ProposalSurface["listActionableProposals"]>;
  accepted: ReturnType<ProposalSurface["listUnrealizedAcceptedAllocations"]>;
  realized: ReturnType<RealizationSurface["listRealizedScheduleFacts"]>;
  qualification: SourceQualifications;
  check(): PublicationSourceCheck;
  checkQuery(): PublicationSourceCheck;
  currentQualification(): SourceQualifications;
};
export function createReviewSourceCapture(options: {
  getState(): DayFrameState;
  getSetup(): DayFrameAuthoredSetup;
  getActiveIngress(): Ingress;
  getSleep(): SleepFoundationAuthority;
  getSleepStatus(): SleepFoundationAuthority["status"];
  activeObservation: SourceObservation;
  proposals: ProposalSurface;
  realizations: RealizationSurface;
  goals: GoalSurface;
  composition: CompositionSurface;
  decisions: PlanDecisionSurface;
  history: HistoricalPlanSurface;
}) {
  const observations = () => [
    options.activeObservation,
    options.proposals.getProposalReviewEvidence().observation,
    options.realizations.getRealizationReviewEvidence().observation,
    options.goals.getGoalReviewObservation(),
    options.composition.getCompositionReviewObservation(),
    options.decisions.getPlanDecisionReviewObservation(),
  ];
  const currentQualification = (): SourceQualifications => {
    const realization = options.realizations.getRealizationIngressStatus(),
      evidence = options.realizations.getRealizationReviewEvidence();
    const sleep = options.getSleepStatus();
    const decisionIngress = options.decisions.getPlanDecisionIngressStatus();
    const result: Record<PublicationSource, SourceQualification> = {
      proposal: proposalQualification(
        options.proposals.getProposalIngressStatus(),
        options.proposals.getProposalDurabilityStatus(),
        options.proposals.getProposalReviewEvidence(),
      ),
      realization:
        realization === "protected"
          ? unqualified("realization", evidence.protectionCause ?? "protected", undefined, true)
          : evidence.active
            ? unqualified("realization", "writeInProgress", undefined, true)
            : realization === "ready"
              ? qualified("verifiedCommitted", "verified")
              : unqualified("realization", "initializing"),
      activeSetup: runtimeQualification("activeSetup", options.getActiveIngress()),
      planDecision:
        decisionIngress.status === "noSource" &&
        decisionIngress.reason !== "storageUnavailable" &&
        options.decisions.getPlanDecisions().length > 0
          ? unqualified("planDecision", "qualificationUnavailable", decisionIngress.reason, true)
          : runtimeQualification(
              "planDecision",
              decisionIngress,
              options.decisions.getPlanDecisionDurabilityStatus(),
            ),
      composition: runtimeQualification(
        "composition",
        options.composition.getCompositionIngressStatus(),
        options.composition.getCompositionDurabilityStatus(),
      ),
      goal: runtimeQualification(
        "goal",
        options.goals.getGoalIngressStatus(),
        options.goals.getGoalDurabilityStatus(),
      ),
      sleepFoundation:
        sleep === "complete"
          ? qualified()
          : unqualified(
              "sleepFoundation",
              sleep === "protected" ? "protected" : "coverageIncomplete",
            ),
      historicalPlan: historyQualification(options.history.getStatus()),
    };
    // Sleep has no independent authority: retain the actual unavailable constituent issue.
    const dependency = [
      result.activeSetup,
      result.planDecision,
      result.composition,
      result.realization,
    ].find((value) => value.status === "unqualified");
    if (dependency) result.sleepFoundation = dependency;
    return result;
  };
  return (origin: PublicationOrigin): ReviewSourceSnapshot => {
    const stamps = observations().map((observation) => [observation, observation.token()] as const);
    const historyObservation = options.history.getHistoricalPlanReviewObservation(),
      historyToken = historyObservation.token();
    const qualification = currentQualification();
    const check = (): PublicationSourceCheck => {
      if (!origin.isCurrent()) return { status: "rejected", reason: "contextReplaced" };
      const failure = qualificationFailure(currentQualification());
      if (failure) return failure;
      if (stamps.some(([observation, token]) => observation.token() !== token))
        return { status: "rejected", reason: "sourceChanged" };
      return { status: "current" };
    };
    return {
      state: structuredClone(options.getState()),
      setup: structuredClone(options.getSetup()),
      goals: options.goals.listGoals(),
      sleep: structuredClone(options.getSleep()),
      proposals: options.proposals.listActionableProposals(),
      accepted: options.proposals.listUnrealizedAcceptedAllocations(),
      realized: options.realizations.listRealizedScheduleFacts(),
      qualification,
      currentQualification,
      check,
      checkQuery: () => {
        if (!origin.isCurrent()) return { status: "rejected", reason: "contextReplaced" };
        // Stable blocked sources remain a current, explicitly blocked query.
        if (
          stamps.some(([observation, token]) => observation.token() !== token) ||
          historyObservation.token() !== historyToken
        )
          return (
            qualificationFailure(currentQualification()) ?? {
              status: "rejected",
              reason: "sourceChanged",
            }
          );
        return { status: "current" };
      },
    };
  };
}
const witnesses = new WeakMap<object, ReviewSourceSnapshot>();
export function bindReviewSources(review: object, snapshot: ReviewSourceSnapshot) {
  witnesses.set(review, snapshot);
}
export function getReviewSources(review: object) {
  return witnesses.get(review);
}
export function checkReviewSources(review: object): PublicationSourceCheck {
  return (
    witnesses.get(review)?.check() ?? {
      status: "rejected",
      reason: "publicationSourceUnqualified",
      sourceIssues: [
        {
          source: "proposal",
          reason: "qualificationUnavailable",
          coverage: { status: "unknown", basis: "wholeAuthority" },
        },
      ],
    }
  );
}
