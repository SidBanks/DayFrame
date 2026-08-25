import {
  projectOccurrenceOutcome,
  type ExecutionAssertionRecordV1,
  type ExecutionRecordV1,
  type ExecutionSubjectId,
  type OccurrenceOutcome,
} from "./executionRecord.js";

export type ExecutionHistoryItem = {
  subjectId: ExecutionSubjectId;
  currentOutcome: OccurrenceOutcome;
  currentRecord: ExecutionRecordV1;
  snapshot: ExecutionAssertionRecordV1["snapshot"];
  subject: ExecutionAssertionRecordV1["subject"];
  revisions: ExecutionRecordV1[];
};

export function buildExecutionHistoryItems(
  records: readonly ExecutionRecordV1[],
): ExecutionHistoryItem[] {
  const grouped = new Map<ExecutionSubjectId, ExecutionRecordV1[]>();
  for (const record of records)
    grouped.set(record.subjectId, [...(grouped.get(record.subjectId) ?? []), record]);
  const items: ExecutionHistoryItem[] = [];
  for (const [subjectId, subjectRecords] of grouped) {
    const revisions = orderSubjectChain(subjectRecords);
    const latestAssertion = [...revisions]
      .reverse()
      .find((record): record is ExecutionAssertionRecordV1 => record.kind === "assertion");
    const currentRecord = revisions.at(-1);
    if (!latestAssertion || !currentRecord) continue;
    const currentOutcome = projectOccurrenceOutcome([...records], subjectId);
    if (currentOutcome.status === "invalid") continue;
    items.push({
      subjectId,
      currentOutcome: structuredClone(currentOutcome),
      currentRecord: structuredClone(currentRecord),
      snapshot: structuredClone(latestAssertion.snapshot),
      subject: structuredClone(latestAssertion.subject),
      revisions: revisions.map((record) => structuredClone(record)),
    });
  }
  return items.sort(
    (left, right) =>
      right.snapshot.userDay.date.localeCompare(left.snapshot.userDay.date) ||
      plannedStart(right).localeCompare(plannedStart(left)) ||
      left.subjectId.localeCompare(right.subjectId),
  );
}

export function orderSubjectChain(records: readonly ExecutionRecordV1[]): ExecutionRecordV1[] {
  if (records.length === 0) return [];
  const byReplacement = new Map(
    records
      .filter((record) => record.replacesRecordId)
      .map((record) => [record.replacesRecordId!, record]),
  );
  const root = records.find((record) => !record.replacesRecordId);
  if (!root) return [];
  const ordered: ExecutionRecordV1[] = [root];
  while (byReplacement.has(ordered.at(-1)!.id))
    ordered.push(byReplacement.get(ordered.at(-1)!.id)!);
  return ordered;
}

function plannedStart(item: ExecutionHistoryItem): string {
  return item.snapshot.plan.state === "scheduled" ? item.snapshot.plan.startsAt : "";
}
