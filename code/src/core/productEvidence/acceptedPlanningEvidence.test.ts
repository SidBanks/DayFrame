import { describe, it, expect } from "vitest";
import { buildAcceptedPlanningEvidence } from "./acceptedPlanningEvidence.js";
import { lineageFixture } from "./evidenceTestFixtures.js";
import { validatePlanPublicationBatch } from "../historicalPlan/historicalPlanValidation.js";
import { validateProposalAuthority } from "../planning/proposal.js";
import { validateRealizationAuthority } from "../planning/acceptedAllocationRealization.js";
import { available } from "./evidence.js";
function projected(input: Parameters<typeof buildAcceptedPlanningEvidence>[0]) {
  const result = buildAcceptedPlanningEvidence(input);
  if (result.status !== "projected") throw Error(JSON.stringify(result));
  return result;
}
describe("G2 accepted planning evidence", () => {
  it("keeps Network+ 10h and 20h acceptances distinct, with productive/support/protection lineage", () => {
    const fixture = lineageFixture();
    if (
      fixture.input.proposals.status !== "available" ||
      fixture.input.realizations.status !== "available"
    )
      throw Error("fixture");
    expect(validateProposalAuthority(fixture.input.proposals.value)).toMatchObject({
      status: "valid",
    });
    expect(validateRealizationAuthority(fixture.input.realizations.value)).toMatchObject({
      status: "valid",
    });
    const result = projected(fixture.input);
    if (result.facts.status !== "available" || result.iterations.status !== "available")
      throw Error("coverage");
    expect(
      result.iterations.value.map((i) => [i.accepted.id, i.accepted.productiveMinutes]),
    ).toEqual([
      ["accepted-A", 600],
      ["accepted-B", 1200],
      ["accepted-C", 60],
    ]);
    for (const id of ["accepted-A", "accepted-B"]) {
      const facts = result.facts.value.filter((f) => f.origin.acceptedAllocationId === id);
      expect(facts).toHaveLength(3);
      expect(new Set(facts.map((f) => f.role))).toEqual(
        new Set(["productiveGoalWork", "supportActivity", "bufferProtection"]),
      );
      expect(new Set(facts.map((f) => f.origin.proposalId)).size).toBe(1);
      expect(new Set(facts.map((f) => f.origin.realizationId)).size).toBe(1);
      expect(
        facts.every((f) => f.verification === "resolved" && f.lineage.goalId === "goal-network"),
      ).toBe(true);
    }
    expect(fixture.a.proposalId).not.toBe(fixture.b.proposalId);
    expect(
      result.iterations.value.find((i) => i.accepted.id === "accepted-C")?.realizationState,
    ).toBe("acceptedButUnrealized");
    expect(
      result.iterations.value.every((i) => i.currentness.supersession === "notRepresented"),
    ).toBe(true);
    expect(result.progress).toBe("notInferred");
  });
  it("supports exact fact, allocation and Goal queries without merging iterations", () => {
    const { input, facts } = lineageFixture();
    for (const kind of ["scheduledFact", "acceptedAllocation", "goal"] as const) {
      const id =
        kind === "scheduledFact"
          ? facts[0]!.id
          : kind === "acceptedAllocation"
            ? "accepted-A"
            : "goal-network";
      const result = projected({ ...input, query: { ...input.query, select: { kind, id } } });
      expect(result.facts.status === "available" && result.facts.value.length).toBe(
        kind === "scheduledFact" ? 1 : kind === "acceptedAllocation" ? 3 : 6,
      );
    }
  });
  it("retains frozen provenance without current accepted/realization records, and distinguishes unknown from empty", () => {
    const { input } = lineageFixture();
    const result = projected({
      ...input,
      proposals: { status: "protected", reason: "test" },
      realizations: { status: "protected", reason: "test" },
    });
    expect(result.completeness).toBe("partial");
    expect(result.iterations.status).toBe("protected");
    expect(result.facts.status === "available" && result.facts.value[0]?.verification).toBe(
      "retainedReferenceOnly",
    );
    const blocked = projected({
      ...input,
      proposals: { status: "protected", reason: "test" },
      realizations: { status: "protected", reason: "test" },
      history: { status: "protected", reason: "test" },
    });
    expect(blocked.lookup).toBe("unknown");
    expect(blocked.facts.status).toBe("unavailable");
    const missing = projected({
      ...input,
      query: { ...input.query, select: { kind: "scheduledFact", id: "missing" } },
    });
    expect(missing.lookup).toBe("notFoundInRange");
  });
  it("is deterministic across source iteration order and isolates output mutations", () => {
    const { input } = lineageFixture();
    const first = projected(input);
    if (input.realizations.status !== "available" || input.proposals.status !== "available")
      throw Error("fixture");
    input.realizations.value.facts.reverse();
    input.realizations.value.realizations.reverse();
    input.proposals.value.acceptedAllocations.reverse();
    expect(projected(input)).toEqual(first);
    if (first.facts.status === "available")
      first.facts.value[0]!.fact.lineage.goalId = "changed" as never;
    expect(JSON.stringify(projected(input))).not.toContain('"changed"');
  });
  it("filters acceptance/realization by real as-of and validates half-open ranges", () => {
    const { input } = lineageFixture();
    const early = projected({
      ...input,
      history: available([]),
      query: { ...input.query, asOf: "2026-09-04T00:00:00.000Z" },
    });
    expect(early.iterations.status === "available" && early.iterations.value).toEqual([]);
    expect(early.facts.status === "available" && early.facts.value).toEqual([]);
    for (const change of [
      { asOf: "bad" },
      { endUserDayDateExclusive: "2026-09-04" },
      { startUserDayDate: "2025-01-01" },
      { startUserDayDate: "2026-02-30" },
    ])
      expect(
        buildAcceptedPlanningEvidence({ ...input, query: { ...input.query, ...change } }).status,
      ).toBe("invalidQuery");
  });
});

it("retains unknown lineage in legal older accepted snapshots rather than claiming no accepted work", () => {
  const { input, publication } = lineageFixture();
  const source = publication.day.occurrences.find(
    (s) => s.version === 3 && s.scheduleRole === "productiveGoalWork",
  )!;
  if (source.version !== 3) throw Error("fixture");
  const legacy = {
    version: 1 as const,
    reference: source.reference,
    sourceFamily: source.sourceFamily,
    title: source.title,
    category: source.category,
    plan: source.plan,
  };
  const history = structuredClone(publication);
  history.day.occurrences = [legacy];
  history.batch.days = [history.day];
  expect(validatePlanPublicationBatch(history.batch)).toMatchObject({ status: "valid" });
  const result = projected({
    ...input,
    history: available([history]),
    proposals: available({
      version: 1,
      proposals: [],
      candidates: [],
      decisions: [],
      acceptedAllocations: [],
    }),
    realizations: available({ version: 1, realizations: [], facts: [] }),
  });
  expect(result.lookup).toBe("unknown");
  expect(result.completeness).toBe("partial");
  expect(
    result.unresolvedHistorical.status === "available" &&
      result.unresolvedHistorical.value[0]?.reason,
  ).toBe("legacyLineageUnavailable");
});
