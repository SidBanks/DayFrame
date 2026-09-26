import { lineageFixture } from "../../core/productEvidence/evidenceTestFixtures.js";
import {
  buildAcceptedPlanningEvidence,
  type AcceptedPlanningEvidenceInput,
} from "../../core/productEvidence/acceptedPlanningEvidence.js";
import { available } from "../../core/productEvidence/evidence.js";
import type { AcceptedSummaryEvidence } from "../acceptedPlanningSummaryPresentation.js";
import { materializeHistoricalPlanExecutionTarget } from "../../core/execution/historicalPlanExecutionTarget.js";
import {
  createExecutionAssertion,
  correctExecutionAssertion,
  retractExecutionRecord,
} from "../../core/execution/executionRecord.js";
import { buildExecutionHistoryItems } from "../../core/execution/executionHistoryProjection.js";
export function networkSummaryFixture(
  outcome: "original" | "corrected" | "withdrawn" = "original",
) {
  const f = lineageFixture();
  const occurrence = f.publication.day.occurrences.find(
    (s) => s.version === 3 && s.scheduleRole === "productiveGoalWork",
  )!;
  const target = materializeHistoricalPlanExecutionTarget({ day: f.publication.day, occurrence });
  if (target.status !== "materialized") throw Error("fixture target");
  const report = createExecutionAssertion(
    {
      subject: { kind: "planned", reference: target.target.reference },
      snapshot: target.target.snapshot,
      outcome: "completed",
      actualTime: { durationMinutes: 40 },
    },
    { now: () => "2026-09-05T00:00:00.000Z" },
  );
  if (report.status !== "created") throw Error("fixture execution");
  const records = [report.record];
  if (outcome !== "original") {
    const corrected = correctExecutionAssertion(
      records,
      report.record.id,
      { snapshot: target.target.snapshot, outcome: "partial", actualTime: { durationMinutes: 20 } },
      { now: () => "2026-09-05T01:00:00.000Z" },
    );
    if (corrected.status !== "created") throw Error("fixture correction");
    records.push(corrected.record);
    if (outcome === "withdrawn") {
      const withdrawn = retractExecutionRecord(records, corrected.record.id, undefined, {
        now: () => "2026-09-05T02:00:00.000Z",
      });
      if (withdrawn.status !== "created") throw Error("fixture withdrawal");
      records.push(withdrawn.record);
    }
  }
  const input: AcceptedPlanningEvidenceInput = {
    ...f.input,
    actual: available(buildExecutionHistoryItems(records)),
  };
  const result = buildAcceptedPlanningEvidence(input);
  if (result.status !== "projected") throw Error("fixture projection");
  const evidence: AcceptedSummaryEvidence = {
    ...result,
    currentSourceContext: [
      {
        reference: { goalId: "goal-network", demandId: "demand-a", demandRevision: 1 },
        interpretation: "currentGoalAndExactDemandRevisionNotFrozenPublication",
        goal: available({
          version: 1,
          id: "goal-network" as never,
          revision: 2,
          title: "Network+ renamed",
          status: "active",
          createdAt: "2026-09-01T00:00:00.000Z",
          updatedAt: "2026-09-05T00:00:00.000Z",
          links: [],
        }),
        demand: { status: "notFound" },
      },
    ],
  };
  return { evidence, input };
}
/** Stress only: canonical projection shape expanded into disjoint display identities, never persisted. */
export function largeSummaryFixture(goals = 20): AcceptedSummaryEvidence {
  const base = networkSummaryFixture().evidence;
  if (base.iterations.status !== "available" || base.facts.status !== "available")
    throw Error("fixture");
  const iterations: typeof base.iterations.value = [],
    facts: typeof base.facts.value = [],
    contexts: typeof base.currentSourceContext = [];
  for (let i = 0; i < goals; i++) {
    const copy: AcceptedSummaryEvidence = JSON.parse(
      JSON.stringify(base)
        .replaceAll("goal-network", `goal-${String(i).padStart(2, "0")}`)
        .replaceAll("accepted-A", `accepted-A-${i}`)
        .replaceAll("accepted-B", `accepted-B-${i}`)
        .replaceAll("accepted-C", `accepted-C-${i}`),
    );
    if (copy.iterations.status !== "available" || copy.facts.status !== "available") throw Error();
    for (const fact of copy.facts.value) fact.fact.id = `${fact.fact.id}-${i}` as never;
    for (const ctx of copy.currentSourceContext)
      if (ctx.goal.status === "available")
        ctx.goal.value.title = `Goal ${String(i + 1).padStart(2, "0")} — A long professional development and certification planning title that must wrap on a narrow phone`;
    iterations.push(...copy.iterations.value);
    facts.push(
      ...[0, 1, 2].flatMap((n) =>
        copy.facts.status === "available"
          ? copy.facts.value.map((f) => ({
              ...f,
              fact: { ...f.fact, id: `${f.fact.id}-${n}` as never },
            }))
          : [],
      ),
    );
    contexts.push(...copy.currentSourceContext);
  }
  return {
    ...base,
    iterations: available(iterations),
    facts: { ...available(facts), coverage: "complete" },
    currentSourceContext: contexts,
  };
}
