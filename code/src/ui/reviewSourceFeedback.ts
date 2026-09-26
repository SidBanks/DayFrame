import type { PublicationSourceIssue } from "../state/reviewSourceQualification.js";
export function publicationSourceMessage(issues: readonly PublicationSourceIssue[]) {
  const labels = {
    proposal: "Accepted proposal authority",
    realization: "Realized schedule authority",
    activeSetup: "Saved setup",
    planDecision: "Plan decisions",
    composition: "Schedule composition",
    goal: "Goal metadata",
    sleepFoundation: "Sleep foundation",
    historicalPlan: "Saved plan history",
  };
  const reasons = {
    initializing: "is still initializing",
    readUnavailable: "cannot be read",
    protected: "is protected",
    writeInProgress: "has a write in progress",
    commitUnconfirmed: "has an unconfirmed commit",
    verificationFailed: "failed commit verification",
    coverageIncomplete: "has incomplete coverage",
    pendingDurability: "is not yet durable",
    qualificationUnavailable: "has unknown qualification",
  };
  return (
    issues
      .map(
        (issue) =>
          `${labels[issue.source]} ${reasons[issue.reason]} (${issue.source}/${issue.reason}).`,
      )
      .join(" ") +
    " Review and publication require complete qualified sources; readable records remain available for inspection."
  );
}
