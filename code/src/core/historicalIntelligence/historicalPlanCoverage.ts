import type { HistoricalPlanDayPublicationV1 } from "../historicalPlan/historicalPlan.js";
import type { LocalDateString } from "../shifts/types.js";

export type HistoricalPlanEvidenceV1 = {
  day: HistoricalPlanDayPublicationV1;
  batchId: string;
  publishedAt: string;
};

export type HistoricalPlanCoverageV1 = {
  status: "complete" | "incompleteCoverage" | "unavailable";
  expectedDayCount: number;
  publishedDayCount: number;
  publishedEmptyDayCount: number;
  missingDayCount: number;
  missingUserDayDates: LocalDateString[];
};

export function resolveHistoricalPlanCoverageV1(input: {
  startUserDayDate: LocalDateString;
  endUserDayDate: LocalDateString;
  evaluationAsOf: string;
  days: readonly HistoricalPlanEvidenceV1[];
  missingUserDayDates: readonly LocalDateString[];
}): { coverage: HistoricalPlanCoverageV1; days: HistoricalPlanEvidenceV1[] } {
  const expectedDates = enumerateDates(input.startUserDayDate, input.endUserDayDate);
  const expected = new Set(expectedDates);
  const missing = [
    ...new Set(input.missingUserDayDates.filter((date) => expected.has(date))),
  ].sort() as LocalDateString[];
  const missingSet = new Set(missing);
  const days = input.days
    .filter(
      (value) =>
        expected.has(value.day.userDayDate) &&
        value.publishedAt <= input.evaluationAsOf &&
        !missingSet.has(value.day.userDayDate),
    )
    .map((value) => structuredClone(value))
    .sort((left, right) => left.day.userDayDate.localeCompare(right.day.userDayDate));
  const publishedDates = new Set(days.map((value) => value.day.userDayDate));
  for (const date of expectedDates) {
    if (!publishedDates.has(date) && !missingSet.has(date)) missing.push(date);
  }
  missing.sort();
  const publishedDayCount = publishedDates.size;
  return {
    coverage: {
      status:
        publishedDayCount === 0
          ? "unavailable"
          : missing.length === 0
            ? "complete"
            : "incompleteCoverage",
      expectedDayCount: expectedDates.length,
      publishedDayCount,
      publishedEmptyDayCount: days.filter((value) => value.day.occurrences.length === 0).length,
      missingDayCount: missing.length,
      missingUserDayDates: [...missing],
    },
    days,
  };
}

function enumerateDates(start: LocalDateString, end: LocalDateString): LocalDateString[] {
  const dates: LocalDateString[] = [];
  for (
    let at = Date.parse(`${start}T00:00:00.000Z`);
    at <= Date.parse(`${end}T00:00:00.000Z`);
    at += 86_400_000
  )
    dates.push(new Date(at).toISOString().slice(0, 10) as LocalDateString);
  return dates;
}
