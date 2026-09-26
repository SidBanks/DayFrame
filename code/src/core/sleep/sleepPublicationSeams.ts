import type {
  PlanPublicationBatchV1,
  HistoricalPlanDayPublicationV1,
  HistoricalPlannedOccurrenceSnapshot,
} from "../historicalPlan/historicalPlan.js";
/** A replacement owns complete owner days. Neighbors retain their immutable physical truth. */
export function hasSleepPublicationSeamConflict(
  candidate: PlanPublicationBatchV1,
  history: readonly PlanPublicationBatchV1[],
): boolean {
  const effective = new Map<string, { publishedAt: string; day: HistoricalPlanDayPublicationV1 }>();
  for (const batch of history) {
    if (batch.publishedAt > candidate.publishedAt) continue;
    for (const day of batch.days)
      if (
        !effective.has(day.userDayDate) ||
        effective.get(day.userDayDate)!.publishedAt < batch.publishedAt
      )
        effective.set(day.userDayDate, { publishedAt: batch.publishedAt, day });
  }
  const replacing = new Set(candidate.days.map((day) => day.userDayDate));
  const adjacent = [...effective.values()]
    .filter((value) => !replacing.has(value.day.userDayDate))
    .flatMap((value) => value.day.occurrences);
  const incoming = candidate.days.flatMap((day) => day.occurrences);
  return incoming.some((left) =>
    adjacent.some(
      (right) =>
        (left.version === 4 || right.version === 4) && sleepPhysicalIntervalsOverlap(left, right),
    ),
  );
}
export function sleepPhysicalIntervalsOverlap(
  left: HistoricalPlannedOccurrenceSnapshot,
  right: HistoricalPlannedOccurrenceSnapshot,
): boolean {
  if (left.plan.state !== "scheduled" || right.plan.state !== "scheduled") return false;
  const a =
    left.version === 4
      ? {
          startsAt: left.sleep.occurrence.footprintStart,
          endsAt: left.sleep.occurrence.footprintEnd,
        }
      : left.plan;
  const b =
    right.version === 4
      ? {
          startsAt: right.sleep.occurrence.footprintStart,
          endsAt: right.sleep.occurrence.footprintEnd,
        }
      : right.plan;
  return (
    Date.parse(a.startsAt) < Date.parse(b.endsAt) && Date.parse(b.startsAt) < Date.parse(a.endsAt)
  );
}
