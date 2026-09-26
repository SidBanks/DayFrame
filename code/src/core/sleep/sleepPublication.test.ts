import { fixture, published } from "./sleepPublicationTestFixtures.js";
import { expect, it } from "vitest";
import { materializePlanPublication } from "../historicalPlan/materializePlanPublication.js";
import { hasSleepPublicationSeamConflict } from "./sleepPublicationSeams.js";
import { historicalPlanBatchFingerprint } from "../historicalPlan/historicalPlanFingerprint.js";
import { validatePlanPublicationBatch } from "../historicalPlan/historicalPlanValidation.js";
import { createExecutionAssertion, validateExecutionRecord } from "../execution/executionRecord.js";
import { publishedSleepExecutionTarget } from "./sleepExecution.js";
import type { SleepFoundationAuthority } from "./sleepFoundationalOccupancy.js";
it("cross-midnight publication freezes a full footprint once on its canonical owner day", () => {
  const batch = published();
  const snapshots = batch.days.flatMap((day) => day.occurrences);
  expect(snapshots).toHaveLength(1);
  const snapshot = snapshots[0]!;
  if (snapshot.version !== 4) throw Error();
  expect(snapshot.reference.coordinate.userDayDate).toBe("2026-09-17");
  expect(
    snapshot.sleep.occurrence.footprintEnd >
      snapshot.sleep.occurrence.derivationContext.ownerWindow.endsAt,
  ).toBe(true);
  expect(
    Date.parse(snapshot.plan.state === "scheduled" ? snapshot.plan.endsAt : "") -
      Date.parse(snapshot.sleep.occurrence.sleepStart),
  ).toBe(120 * 60000);
});
it("adjacent and overlapping publications keep owner identity without clipping or contradictory seams", () => {
  const first = published(fixture());
  const next = published(fixture("2026-09-18"));
  expect(hasSleepPublicationSeamConflict(next, [first])).toBe(false);
  const conflict = published(fixture("2026-09-18", "00:00"));
  expect(hasSleepPublicationSeamConflict(conflict, [first])).toBe(true);
  expect(hasSleepPublicationSeamConflict(first, [first])).toBe(false);
});
it("fresh materialization ignores tampered Preview Sleep geometry and uses current requirement", () => {
  const input = fixture();
  const stale = structuredClone(input.preview.result.foundation!);
  if (stale.sleep.status !== "satisfied") throw Error();
  stale.sleep.occurrences[0]!.sleepStart = "1900-01-01T00:00:00.000Z";
  input.preview.result.foundation = stale;
  const before = JSON.stringify(input);
  const batch = published(input);
  expect(JSON.stringify(input)).toEqual(before);
  expect(validatePlanPublicationBatch(batch).status).toBe("valid");
  input.authoredSetup.sleepRequirements![0]!.durationMinutes = 180;
  const updated = published(input);
  const snapshot = updated.days[0]!.occurrences[0]!;
  if (snapshot.version !== 4) throw Error();
  expect(snapshot.sleep.occurrence.durationMinutes).toBe(180);
  expect(historicalPlanBatchFingerprint(updated)).not.toBe(historicalPlanBatchFingerprint(batch));
});
it.each(["protected", "contextIncomplete"] as const)(
  "blocks %s canonical authority despite a satisfied Preview",
  (status) => {
    const input = fixture();
    input.sleepAuthority = { ...input.sleepAuthority, status } as SleepFoundationAuthority;
    expect(materializePlanPublication(input).status).toBe("inconsistentPlanContext");
  },
);
it("blocks fresh infeasibility, missing authority, stale Preview, and Try", () => {
  const input = fixture();
  input.authoredSetup.sleepRequirements![0]!.durationMinutes = 1440;
  expect(materializePlanPublication(input).status).toBe("inconsistentPlanContext");
  const clean = fixture();
  expect(
    materializePlanPublication({ ...clean, sleepAuthority: undefined } as unknown as Parameters<
      typeof materializePlanPublication
    >[0]).status,
  ).toBe("inconsistentPlanContext");
  clean.preview.isStale = true;
  expect(materializePlanPublication(clean).status).toBe("stalePreview");
  clean.preview.isStale = false;
  clean.preview.revisedAt = "2026-09-16T01:00:00.000Z";
  expect(materializePlanPublication(clean).status).toBe("tryPreview");
});
it("coverage distinguishes not configured from not applicable and legacy", () => {
  const input = fixture();
  input.authoredSetup.sleepRequirements = [];
  const absent = published(input);
  expect(absent.days[0]!.sleepCoverage).toBe("notConfigured");
  const future = fixture();
  future.authoredSetup.sleepRequirements![0]!.effectiveFrom = "2027-01-01";
  expect(published(future).days[0]!.sleepCoverage).toBe("notApplicable");
});
it.each([
  ["2026-03-08T07:30:00.000Z", 120],
  ["2026-11-01T06:30:00.000Z", 120],
  ["2026-09-18T01:30:00.000Z", 300],
] as const)(
  "actual physical elapsed evidence survives DST/boundary: %s",
  (occurredAt, durationMinutes) => {
    const snapshot = published().days[0]!.occurrences[0]!;
    if (snapshot.version !== 4) throw Error();
    const result = createExecutionAssertion(
      {
        ...publishedSleepExecutionTarget(snapshot),
        outcome: "completed",
        actualTime: { occurredAt, durationMinutes },
      },
      { now: () => "2027-01-01T00:00:00.000Z" },
    );
    expect(result.status).toBe("created");
    if (result.status !== "created" || result.record.kind !== "assertion") throw Error();
    expect(result.record.actualTime).toEqual({ occurredAt, durationMinutes });
    expect(result.record.snapshot.userDay.date).toBe("2026-09-17");
  },
);
it("unknown subject version and malformed actual evidence fail closed", () => {
  const snapshot = published().days[0]!.occurrences[0]!;
  if (snapshot.version !== 4) throw Error();
  const result = createExecutionAssertion(
    { ...publishedSleepExecutionTarget(snapshot), outcome: "skipped" },
    { now: () => "2027-01-01T00:00:00.000Z" },
  );
  if (result.status !== "created" || result.record.kind !== "assertion") throw Error();
  const bad = structuredClone(result.record);
  Object.assign(bad.subject, { version: 2 });
  expect(validateExecutionRecord(bad).status).toBe("invalid");
  Object.assign(result.record, {
    actualTime: { occurredAt: "not-an-instant", durationMinutes: 0 },
  });
  expect(validateExecutionRecord(result.record).status).toBe("invalid");
});
it("freezes per-owner applicability when a neighboring guard Sleep is satisfied", () => {
  const input = fixture();
  input.authoredSetup.sleepRequirements![0]!.weekdays = ["friday"];
  const batch = published(input);
  expect(batch.days[0]!.sleepCoverage).toBe("notApplicable");
  expect(batch.days[0]!.occurrences).toEqual([]);
});
it("a changed accepted Sleep pin blocks publication instead of publishing the unconstrained witness", async () => {
  const { trySleepPlacement } = await import("./sleepCorrective.js");
  const input = fixture("2026-09-17", "00:00");
  const foundation = input.preview.result.foundation!;
  if (foundation.sleep.status !== "satisfied") throw Error();
  const occurrence = foundation.sleep.occurrences.find((o) => o.ownerDay === "2026-09-17")!;
  const result = trySleepPlacement(
    {
      authoredState: input.authoredSetup,
      authority: input.sleepAuthority,
      ownerRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" },
    },
    { target: occurrence.reference, sleepStart: occurrence.sleepStart },
  );
  if (result.status !== "available") throw Error();
  input.sleepAuthority.planDecisions = [
    {
      ...result.candidate,
      version: 1,
      id: "00000000-0000-4000-8000-000000000014" as never,
      acceptedAt: "2026-09-16T00:00:00.000Z",
    },
  ];
  input.authoredSetup.sleepRequirements![0]!.durationMinutes = 180;
  expect(materializePlanPublication(input).status).toBe("inconsistentPlanContext");
});
it.each(["searchIncomplete", "invalid", "protected", "contextIncomplete"] as const)(
  "fresh canonical %s proof cannot materialize historical authority",
  async (status) => {
    const planning = await import("../planning/deriveFoundationalSchedule.js");
    const { vi } = await import("vitest");
    const input = fixture();
    const live = planning.deriveFoundationalSchedule({
      authoredState: input.authoredSetup,
      authority: input.sleepAuthority,
      ownerRange: { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" },
    });
    const proof = vi.spyOn(planning, "deriveFoundationalSchedule").mockReturnValue({
      ...live,
      foundation: { ...live.foundation, status: "nonAllocatable", sleep: { status } },
    } as unknown as typeof live);
    try {
      expect(materializePlanPublication(input)).toMatchObject({
        status: "inconsistentPlanContext",
      });
      expect(proof).toHaveBeenCalledOnce();
    } finally {
      proof.mockRestore();
    }
  },
);
