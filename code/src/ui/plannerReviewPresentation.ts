import type { PlanningReviewReadModelV1 } from "../state/planningScopeQuery.js";

export type PlannerPresentationKind =
  | "work"
  | "commitment"
  | "goalWork"
  | "supportActivity"
  | "bufferProtection"
  | "acceptedUnrealized"
  | "proposal";

export type PlannerPresentationItem = {
  id: string;
  kind: PlannerPresentationKind;
  heading: string;
  detail: string;
  userDayDate: string;
  startsAt?: string;
  endsAt?: string;
  fullStartsAt?: string;
  fullEndsAt?: string;
  action: "inspect" | "decide";
};

export type PlannerReviewPresentationV1 = {
  coverage: { tone: "complete" | "warning" | "unknown"; label: string };
  preview: { tone: "current" | "warning" | "unavailable"; label: string };
  publication: { label: string };
  groups: Array<{
    kind: PlannerPresentationKind;
    heading: string;
    items: PlannerPresentationItem[];
  }>;
  isKnownEmpty: boolean;
};

const order: PlannerPresentationKind[] = [
  "work",
  "commitment",
  "goalWork",
  "supportActivity",
  "bufferProtection",
  "acceptedUnrealized",
  "proposal",
];

export function presentPlanningReview(
  model: PlanningReviewReadModelV1,
): PlannerReviewPresentationV1 {
  const items: PlannerPresentationItem[] = [];
  for (const entry of model.derivedSchedule) {
    items.push({
      id: `${entry.scheduleClass}:${entry.fact.id}`,
      kind: entry.scheduleClass,
      heading: entry.scheduleClass === "work" ? "Work" : entry.fact.title,
      detail: entry.scheduleClass === "work" ? "Scheduled work" : "Scheduled commitment",
      userDayDate: entry.fact.userDayDate,
      startsAt: entry.visibleInterval.startsAt,
      endsAt: entry.visibleInterval.endsAt,
      fullStartsAt: entry.authoritativeInterval.startsAt,
      fullEndsAt: entry.authoritativeInterval.endsAt,
      action: "inspect",
    });
  }
  for (const entry of model.scheduledReality) {
    const kind =
      entry.fact.scheduleRole === "productiveGoalWork"
        ? "goalWork"
        : entry.fact.scheduleRole === "supportActivity"
          ? "supportActivity"
          : "bufferProtection";
    items.push({
      id: `${kind}:${entry.fact.id}`,
      kind,
      heading:
        kind === "goalWork"
          ? "Scheduled Goal work"
          : kind === "supportActivity"
            ? "Scheduled support"
            : "Protected Buffer",
      detail:
        kind === "bufferProtection"
          ? "Protected time — not an executable activity"
          : kind === "supportActivity"
            ? "Operational support activity"
            : "Accepted and realized Goal work",
      userDayDate: entry.fact.userDayDate,
      startsAt: entry.visibleInterval.startsAt,
      endsAt: entry.visibleInterval.endsAt,
      fullStartsAt: entry.authoritativeInterval.startsAt,
      fullEndsAt: entry.authoritativeInterval.endsAt,
      action: "inspect",
    });
  }
  for (const entry of model.acceptedLiabilities) {
    items.push({
      id: `accepted:${entry.acceptedAllocationId}:${entry.claim.id}`,
      kind: "acceptedUnrealized",
      heading: "Accepted — awaiting realization",
      detail: `${roleLabel(entry.claim.role)} resource authority; not yet scheduled reality`,
      userDayDate: entry.claim.userDayDate,
      startsAt: entry.visibleInterval.startsAt,
      endsAt: entry.visibleInterval.endsAt,
      fullStartsAt: entry.authoritativeInterval.startsAt,
      fullEndsAt: entry.authoritativeInterval.endsAt,
      action: "inspect",
    });
  }
  for (const entry of model.proposals) {
    items.push({
      id: `proposal:${entry.proposal.id}:${entry.proposal.revision}`,
      kind: "proposal",
      heading: "Proposed planning option",
      detail: `${entry.proposal.options.length} option${entry.proposal.options.length === 1 ? "" : "s"}; user decision required`,
      userDayDate: entry.proposal.horizon.startUserDayDate,
      action: "decide",
    });
  }
  items.sort(
    (a, b) =>
      a.userDayDate.localeCompare(b.userDayDate) ||
      (a.startsAt ?? "").localeCompare(b.startsAt ?? "") ||
      order.indexOf(a.kind) - order.indexOf(b.kind) ||
      a.id.localeCompare(b.id),
  );
  return {
    coverage: coveragePresentation(model.planningDataCoverage),
    preview: previewPresentation(model.preview),
    publication: { label: publicationLabel(model) },
    groups: order.flatMap((kind) => {
      const grouped = items.filter((item) => item.kind === kind);
      return grouped.length ? [{ kind, heading: groupLabel(kind), items: grouped }] : [];
    }),
    isKnownEmpty: model.planningDataCoverage === "complete" && items.length === 0,
  };
}

function coveragePresentation(value: PlanningReviewReadModelV1["planningDataCoverage"]) {
  if (value === "complete")
    return { tone: "complete" as const, label: "Planning data covers this review period." };
  if (value === "partial")
    return {
      tone: "warning" as const,
      label: "Planning data covers only part of this period. Unknown time is not free time.",
    };
  if (value === "none")
    return {
      tone: "unknown" as const,
      label: "Planning data does not cover this period. No empty-schedule claim is available.",
    };
  return {
    tone: "unknown" as const,
    label: "Planning-data coverage is unknown. Missing facts are not treated as an empty schedule.",
  };
}

function previewPresentation(value: PlanningReviewReadModelV1["preview"]) {
  if (value.availability === "unavailable")
    return {
      tone: "unavailable" as const,
      label: "No generated Preview is available for this period.",
    };
  const coverage =
    value.coverage === "covers"
      ? "covers this period"
      : value.coverage === "partiallyCovers"
        ? "covers part of this period"
        : "does not cover this period";
  return {
    tone: value.freshness === "current" ? ("current" as const) : ("warning" as const),
    label: `Preview ${coverage} and is ${value.freshness}.`,
  };
}

function publicationLabel(model: PlanningReviewReadModelV1) {
  const coverage = model.publication.coverage;
  return coverage === "complete"
    ? "Published history covers this period."
    : coverage === "partial"
      ? "Published history covers part of this period."
      : coverage === "none"
        ? "No publication exists for this period."
        : "Publication coverage is unavailable.";
}

function groupLabel(kind: PlannerPresentationKind) {
  return kind === "work"
    ? "Work"
    : kind === "commitment"
      ? "Commitments"
      : kind === "goalWork"
        ? "Goal work"
        : kind === "supportActivity"
          ? "Support activities"
          : kind === "bufferProtection"
            ? "Protected Buffer"
            : kind === "acceptedUnrealized"
              ? "Accepted authority"
              : "Proposals";
}

function roleLabel(role: string) {
  return role === "productive"
    ? "Productive"
    : role === "supportActivity"
      ? "Support"
      : "Buffer protection";
}
