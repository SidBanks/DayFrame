import type { DayFrameStore } from "../state/types.js";
import type { ExecutionHistoryItem } from "../core/execution/executionHistoryProjection.js";
import type { RealizedScheduleFactV1 } from "../core/planning/realizedScheduleIdentity.js";
export type DayResult = Awaited<ReturnType<DayFrameStore["querySelectedDayEvidence"]>>;
export type DayEvidence = Extract<DayResult, { status: "projected" }>;
export type PublishedItem = Extract<
  DayEvidence["published"],
  { status: "available" }
>["value"][number]["items"][number];
export type DayRow = {
  key: string;
  title: string;
  role: string;
  start?: string;
  end?: string;
  allDay?: boolean;
  owner: string;
  layer: string;
  publication?: PublishedItem;
  actual?: ExecutionHistoryItem;
  fact?: RealizedScheduleFactV1;
  goalId?: string;
  goalTitle?: string;
  manual?: Extract<DayEvidence["manual"], { status: "available" }>["value"][number];
  detail?: string;
  relatedTo?: string;
};
export const roleLabel = (role: string) =>
  role === "productiveGoalWork"
    ? "Goal work"
    : role === "supportActivity"
      ? "Preparation / support"
      : role === "bufferProtection"
        ? "Protected time"
        : role;
export function orderRows(rows: DayRow[]) {
  for (const row of rows) {
    const relationship = row.fact?.lineage.relationship;
    const claim =
      relationship &&
      ("productiveClaimId" in relationship
        ? relationship.productiveClaimId
        : "supportClaimId" in relationship
          ? relationship.supportClaimId
          : undefined);
    const parent = claim
      ? rows.find(
          (candidate) =>
            candidate.fact?.origin.acceptedClaimId === claim &&
            candidate.fact.origin.realizationId === row.fact?.origin.realizationId &&
            candidate.publication?.identity.publicationBatchId ===
              row.publication?.identity.publicationBatchId,
        )
      : undefined;
    if (parent)
      row.relatedTo = `${row.role === "supportActivity" ? "Supports" : "Protects"} ${parent.title}`;
  }

  return rows.sort(
    (a, b) =>
      (a.start ?? "").localeCompare(b.start ?? "") ||
      a.role.localeCompare(b.role) ||
      a.key.localeCompare(b.key),
  );
}
export function publishedRows(evidence: DayEvidence, effective = true): DayRow[] {
  if (evidence.published.status !== "available") return [];
  return orderRows(
    evidence.published.value
      .filter((p) => p.effective === effective)
      .flatMap((p) =>
        p.items.map((item) => {
          const s = item.snapshot;
          const fact = s.version === 3 ? s.realizedSchedule : undefined;
          const goal = s.version !== 4 ? s.goals?.[0] : undefined;
          const role =
            s.version === 4
              ? "Sleep"
              : s.version === 3
                ? s.scheduleRole
                : s.sourceFamily === "work"
                  ? "Work"
                  : s.sourceFamily === "manualEvent"
                    ? "Published manual event"
                    : s.reference.sourceKind === "acceptedAllocation"
                      ? s.reference.scheduleRole
                      : "Commitment";
          return {
            key: JSON.stringify(item.identity),
            title:
              role === "bufferProtection" ? "Protected time" : role === "Sleep" ? "Sleep" : s.title,
            role,
            owner: evidence.ownerDay,
            layer: p.effective ? "Published schedule" : "Earlier publication",
            publication: item,
            ...(s.plan.state === "scheduled"
              ? { start: s.plan.startsAt, end: s.plan.endsAt }
              : {
                  detail:
                    s.plan.state === "unplaced"
                      ? "Not placed"
                      : s.plan.state === "omitted"
                        ? "Omitted"
                        : "Placement blocked",
                }),
            allDay: item.timing.coverage === "available" && item.timing.kind === "allDay",
            ...(item.timing.coverage === "unavailableLegacy"
              ? { detail: "Older publication: timed or all-day classification was not retained." }
              : {}),
            ...(fact ? { fact, goalId: fact.lineage.goalId } : goal ? { goalId: goal.goalId } : {}),
            ...(goal ? { goalTitle: goal.title } : {}),
          };
        }),
      ),
  );
}
export function currentRows(e: DayEvidence): DayRow[] {
  const rows: DayRow[] = [];
  if (e.planning.status === "available")
    for (const item of e.planning.value.items)
      rows.push({
        key: `current:${item.subject}:${item.fact.id}`,
        title: item.subject === "work" ? "Work" : item.fact.title,
        role: item.subject === "work" ? "Work" : "Commitment",
        owner: item.ownerDay,
        layer:
          e.planning.value.freshness === "stale"
            ? "Current setup · stale schedule"
            : "Current unpublished schedule",
        start: item.authoritativeInterval.startsAt,
        end: item.authoritativeInterval.endsAt,
      });
  if (e.realized.status === "available")
    for (const item of e.realized.value)
      rows.push({
        key: `realized:${item.fact.id}`,
        title: roleLabel(item.subject),
        role: item.subject,
        owner: item.ownerDay,
        layer: "Current accepted schedule · publication shown separately",
        start: item.authoritativeInterval.startsAt,
        end: item.authoritativeInterval.endsAt,
        fact: item.fact,
        goalId: item.fact.lineage.goalId,
      });
  if (e.sleepPlanning.status === "available" && e.sleepPlanning.value.status === "satisfied")
    for (const s of e.sleepPlanning.value.occurrences) {
      // G1 includes guard owners. Retain their owner labels; show requested Sleep and intersecting footprints only.
      const bounds =
        e.currentCanonicalContext.status === "available"
          ? e.currentCanonicalContext.value.selected
          : null;
      if (
        s.ownerDay !== e.ownerDay &&
        (!bounds ||
          Date.parse(s.footprintStart) >= bounds.end.getTime() ||
          Date.parse(s.footprintEnd) <= bounds.start.getTime())
      )
        continue;
      rows.push({
        key: `sleep:${JSON.stringify(s.reference)}`,
        title: "Sleep",
        role: "Sleep",
        owner: s.ownerDay,
        layer: "Current Sleep planning",
        start: s.sleepStart,
        end: s.sleepEnd,
        detail: `${s.bufferBeforeMinutes} min protected before; ${s.bufferAfterMinutes} min protected after.`,
      });
    }
  return orderRows(rows);
}
export function manualRows(e: DayEvidence): DayRow[] {
  return e.manual.status === "available"
    ? orderRows(
        e.manual.value.map((m) => ({
          key: `manual:${m.evidence.id}`,
          title: m.evidence.title,
          role: "Manual event",
          owner: m.source?.userDayDate ?? m.ownerDay,
          layer: "Authored activity · not an outcome",
          manual: m,
          allDay: m.evidence.kind === "allDayEvent",
          ...(m.evidence.startsAt ? { start: m.evidence.startsAt.toISOString() } : {}),
          ...(m.evidence.endsAt ? { end: m.evidence.endsAt.toISOString() } : {}),
        })),
      )
    : [];
}
export function outcomeText(item?: ExecutionHistoryItem): string {
  if (!item) return "Outcome not recorded";
  if (item.currentRecord.kind === "retraction") return "Report withdrawn · outcome not recorded";
  const status = item.currentOutcome.status;
  const label =
    status === "completed"
      ? "Completed"
      : status === "partial"
        ? "Partially completed"
        : status === "skipped"
          ? "Didn't do it"
          : "Outcome not recorded";
  return `${label}${item.revisions.length > 1 ? " · corrected report" : ""}`;
}
export function rowOutcome(row: DayRow) {
  if (row.role === "bufferProtection") return "Protected time · not an activity";
  if (row.publication)
    return row.publication.actual.status === "available"
      ? row.publication.actual.value.length
        ? row.publication.actual.value.map(outcomeText).join("; ")
        : "Outcome not recorded"
      : "Outcome evidence unavailable";
  return row.actual ? outcomeText(row.actual) : row.layer;
}
export function timeLabel(row: DayRow) {
  if (row.allDay) return "All day";
  if (!row.start || !row.end) return row.detail ?? "Time unavailable";
  const start = new Date(row.start),
    end = new Date(row.end);
  const time = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = (d: Date) => d.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${time(start)}–${time(end)}${start.toDateString() !== end.toDateString() ? ` (${date(start)}–${date(end)})` : ""}`;
}

export function actualInterval(item: ExecutionHistoryItem) {
  const time =
    item.currentOutcome.status !== "unknown" ? item.currentOutcome.record.actualTime : undefined;
  return time?.occurredAt
    ? {
        start: time.occurredAt,
        ...(time.durationMinutes
          ? {
              end: new Date(
                Date.parse(time.occurredAt) + time.durationMinutes * 60000,
              ).toISOString(),
            }
          : {}),
      }
    : {};
}
