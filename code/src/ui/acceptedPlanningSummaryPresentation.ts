import type { DayFrameStore } from "../state/types.js";
export type AcceptedSummaryResult = Awaited<
  ReturnType<DayFrameStore["queryAcceptedPlanningEvidence"]>
>;
export type AcceptedSummaryEvidence = Extract<AcceptedSummaryResult, { status: "projected" }>;
export type AcceptedSummaryIteration = Extract<
  AcceptedSummaryEvidence["iterations"],
  { status: "available" }
>["value"][number];
export type AcceptedSummaryFact = Extract<
  AcceptedSummaryEvidence["facts"],
  { status: "available" }
>["value"][number];
export function acceptedMinutes(
  e: AcceptedSummaryEvidence,
  iteration: AcceptedSummaryIteration,
  goalId: string,
) {
  return iteration.accepted.claims
    .filter(
      (c) =>
        c.goalId === goalId &&
        c.role === "productive" &&
        c.userDayDate >= e.query.startUserDayDate &&
        c.userDayDate < e.query.endUserDayDateExclusive,
    )
    .reduce((sum, c) => sum + c.durationMinutes, 0);
}
/** Group canonical projection records for display only. Preserve the original acceptance in each group. */
export function acceptedGoalGroups(e: AcceptedSummaryEvidence) {
  const groups = new Map<
    string,
    {
      id: string;
      title: string;
      currentName: boolean;
      iterations: AcceptedSummaryIteration[];
      retained: AcceptedSummaryFact[];
    }
  >();
  const get = (id: string) => {
    let group = groups.get(id);
    if (!group) {
      const context = e.currentSourceContext.find(
        (c) => c.reference.goalId === id && c.goal.status === "available",
      );
      group = {
        id,
        title:
          context?.goal.status === "available" ? context.goal.value.title : "Goal name unavailable",
        currentName: context?.goal.status === "available",
        iterations: [],
        retained: [],
      };
      groups.set(id, group);
    }
    return group;
  };
  if (e.iterations.status === "available")
    for (const iteration of e.iterations.value) {
      const goalIds = new Set(
        iteration.accepted.claims
          .filter(
            (c) =>
              c.userDayDate >= e.query.startUserDayDate &&
              c.userDayDate < e.query.endUserDayDateExclusive,
          )
          .map((c) => c.goalId),
      );
      for (const id of goalIds) get(id).iterations.push(iteration);
    }
  if (e.facts.status === "available")
    for (const fact of e.facts.value) {
      const group = get(fact.lineage.goalId);
      if (
        !group.iterations.some(
          (i) =>
            i.accepted.id === fact.origin.acceptedAllocationId &&
            i.accepted.revision === fact.origin.acceptedAllocationRevision,
        )
      )
        group.retained.push(fact);
    }
  for (const group of groups.values())
    group.iterations.sort(
      (a, b) =>
        a.accepted.acceptedAt.localeCompare(b.accepted.acceptedAt) ||
        a.accepted.id.localeCompare(b.accepted.id) ||
        a.accepted.revision - b.accepted.revision,
    );
  return [...groups.values()].sort(
    (a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
  );
}
export function iterationFacts(
  e: AcceptedSummaryEvidence,
  iteration: AcceptedSummaryIteration,
  goalId: string,
) {
  return e.facts.status === "available"
    ? e.facts.value.filter(
        (f) =>
          f.origin.acceptedAllocationId === iteration.accepted.id &&
          f.origin.acceptedAllocationRevision === iteration.accepted.revision &&
          f.lineage.goalId === goalId,
      )
    : [];
}
export const effort = (minutes: number) =>
  minutes % 60 === 0 ? `${minutes / 60} h` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
export const schedulingLabel = (value: AcceptedSummaryIteration["realizationState"]) =>
  value === "realized"
    ? "Scheduled"
    : value === "acceptedButUnrealized"
      ? "Accepted — awaiting scheduling"
      : "Scheduling evidence unavailable";
export const factRole = (value: AcceptedSummaryFact["role"]) =>
  value === "productiveGoalWork"
    ? "Goal work"
    : value === "supportActivity"
      ? "Preparation"
      : "Protected time · not an activity";
export function factOutcome(fact: AcceptedSummaryFact) {
  if (fact.role === "bufferProtection") return "No activity outcome applies to protected time.";
  if (fact.execution.status !== "available")
    return fact.execution.status === "protected"
      ? "Outcome information cannot currently be read safely."
      : "Outcome evidence unavailable.";
  if (!fact.execution.value.length) return "Outcome not recorded";
  return fact.execution.value
    .map((item) => {
      if (item.currentRecord.kind === "retraction")
        return "Report withdrawn · outcome not recorded";
      const status = item.currentOutcome.status;
      const text =
        status === "completed"
          ? "Completed"
          : status === "partial"
            ? "Partially completed"
            : status === "skipped"
              ? "Didn't do it"
              : "Outcome not recorded";
      return text + (item.revisions.length > 1 ? " · corrected report" : "");
    })
    .join("; ");
}
export function publicationLabel(fact: AcceptedSummaryFact) {
  return fact.publication.status === "available"
    ? fact.publication.value.length
      ? `In ${fact.publication.value.length} retained published schedule${fact.publication.value.length === 1 ? "" : "s"}`
      : "No retained publication found in this period"
    : fact.publication.status === "protected"
      ? "Publication information cannot currently be read safely"
      : "Publication evidence unavailable";
}
