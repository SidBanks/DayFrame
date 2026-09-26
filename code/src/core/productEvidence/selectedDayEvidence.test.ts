import { it, expect } from "vitest";
import { buildSelectedDayEvidence, type SelectedDayEvidenceInput } from "./selectedDayEvidence.js";
import { buildAcceptedPlanningEvidence } from "./acceptedPlanningEvidence.js";
import { lineageFixture } from "./evidenceTestFixtures.js";
import { available } from "./evidence.js";
import { createBootstrapPlaceholderState } from "../../state/dayFrameReadiness.js";
import { materializeHistoricalPlanExecutionTarget } from "../execution/historicalPlanExecutionTarget.js";
import { createExecutionAssertion } from "../execution/executionRecord.js";
import { buildExecutionHistoryItems } from "../execution/executionHistoryProjection.js";
function fixture(): SelectedDayEvidenceInput {
  const f = lineageFixture();
  return {
    query: { ownerDay: "2026-09-04", asOf: "2026-09-06T12:00:00.000Z" },
    state: createBootstrapPlaceholderState(),
    authoredStatus: "available",
    realized: available(f.facts),
    sleep: { status: "notApplicable", reason: "fixture" },
    history: f.input.history,
    actual: available([]),
  };
}
function projected(input: SelectedDayEvidenceInput) {
  const r = buildSelectedDayEvidence(input);
  if (r.status !== "projected") throw Error("projection");
  return r;
}
it("G1 retains productive/support/protection roles and full cross-midnight intervals with clipped display geometry", () => {
  const input = fixture(),
    result = projected(input);
  if (result.realized.status !== "available" || result.published.status !== "available")
    throw Error("coverage");
  const cross = result.realized.value.find(
    (i) =>
      i.fact.origin.acceptedAllocationId === "accepted-B" && i.subject === "productiveGoalWork",
  )!;
  expect(cross.ownerDay).toBe("2026-09-04");
  expect(cross.authoritativeInterval.endsAt).toBe("2026-09-05T10:00:00.000Z");
  expect(cross.visibleInterval).not.toEqual(cross.authoritativeInterval);
  expect(new Set(result.realized.value.map((i) => i.subject))).toEqual(
    new Set(["productiveGoalWork", "supportActivity", "bufferProtection"]),
  );
  const published = result.published.value[0]!;
  expect(
    published.items
      .filter((i) => i.snapshot.version === 3 && i.snapshot.scheduleRole === "bufferProtection")
      .every((i) => i.reporting.status === "notReportable"),
  ).toBe(true);
  expect(
    published.items
      .filter((i) => i.snapshot.version === 3 && i.snapshot.scheduleRole !== "bufferProtection")
      .every((i) => i.reporting.status === "targetAvailable"),
  ).toBe(true);
  input.state.schedulingPreferences.dayBoundaryStartTime = "08:00";
  const edited = projected(input);
  expect(edited.published).toEqual(result.published);
  expect(edited.currentCanonicalContext).not.toEqual(result.currentCanonicalContext);
});
it("G1 and G2 associate explicit execution using the canonical published reference, never Goal title or time", () => {
  const f = lineageFixture(),
    input = fixture();
  const occurrence = f.publication.day.occurrences.find(
    (s) => s.version === 3 && s.scheduleRole === "productiveGoalWork",
  )!;
  const target = materializeHistoricalPlanExecutionTarget({ day: f.publication.day, occurrence });
  if (target.status !== "materialized") throw Error("target");
  const record = createExecutionAssertion(
    {
      subject: { kind: "planned", reference: target.target.reference },
      snapshot: target.target.snapshot,
      outcome: "skipped",
    },
    { now: () => input.query.asOf },
  );
  if (record.status !== "created") throw Error(JSON.stringify(record));
  const actual = available(buildExecutionHistoryItems([record.record]));
  const selected = projected({ ...input, actual });
  if (selected.published.status !== "available") throw Error("publication");
  expect(
    selected.published.value[0]!.items.filter((i) => i.outcomeKnowledge === "explicitRecord"),
  ).toHaveLength(1);
  const lineage = buildAcceptedPlanningEvidence({ ...f.input, actual });
  if (lineage.status !== "projected" || lineage.facts.status !== "available")
    throw Error("lineage");
  expect(
    lineage.facts.value.filter(
      (f) => f.execution.status === "available" && f.execution.value.length,
    ),
  ).toHaveLength(1);
  expect(lineage.progress).toBe("notInferred");
});
it("known-empty publication differs from not-published, and execution protection cannot masquerade as unreported", () => {
  const input = fixture();
  if (input.history.status !== "available") throw Error("fixture");
  input.history.value[0]!.day.occurrences = [];
  const empty = projected(input);
  expect(empty.publicationCoverage).toBe("published");
  expect(empty.published.status === "available" && empty.published.value[0]?.items).toEqual([]);
  expect(projected({ ...input, history: available([]) }).publicationCoverage).toBe("notPublished");
  const protectedInput = fixture();
  protectedInput.actual = { status: "protected", reason: "quarantine" };
  const protectedResult = projected(protectedInput);
  expect(
    protectedResult.published.status === "available" &&
      protectedResult.published.value[0]!.items.every(
        (i) => i.outcomeKnowledge === "unavailable" && i.reporting.status === "unavailable",
      ),
  ).toBe(true);
});
it("G1 deterministic output never aliases input authority", () => {
  const input = fixture();
  const first = projected(input);
  expect(projected(input)).toEqual(first);
  if (first.published.status === "available")
    first.published.value[0]!.frozenDay.occurrences[0]!.title = "mutated";
  expect(JSON.stringify(projected(input))).not.toContain('"mutated"');
});
