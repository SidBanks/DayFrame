import { createReviewScope } from "../core/planning/reviewScope.js";
import { publicationBlockers } from "./publicationEligibility.js";
import { beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createProposalSurface } from "./proposalSurface.js";
import { evaluatePlanningRequest } from "./constructivePlanningWorkflow.js";
import type { DayFrameStore } from "./types.js";
import type { SleepRequirementIntentV1 } from "../core/sleep/sleepRequirement.js";

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  clear() {
    this.values.clear();
  }
}
let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
});
const range = { startUserDayDate: "2026-09-17", endUserDayDateExclusive: "2026-09-18" } as const;
const at = "2099-09-01T00:00:00.000Z";
function author(store: DayFrameStore, patch: Partial<SleepRequirementIntentV1> = {}) {
  const head = store.getState().sleepRequirements?.at(-1);
  const result = store.authorSleepRequirement({
    id: "sleep",
    expectedRevision: head?.revision ?? null,
    ...(head ? { expectedIncarnationId: head.incarnationId } : {}),
    recordedAt: at,
    intent: {
      enabled: true,
      effectiveFrom: "2026-09-01",
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "02:00" },
      ...patch,
    },
  });
  expect(result.status).toBe("authored");
  return result;
}
async function start() {
  const durable = createDayFrameDurableDb();
  const store = createDayFrameStore(undefined, { restoreIndexedDb: durable });
  await store.whenReady();
  store.setSchedulingPreferences({ dayBoundaryStartTime: "00:00", weekStartsOn: "monday" });
  author(store);
  const goal = await store.createGoal({ title: "Study" });
  if (goal.status !== "accepted") throw new Error("goal");
  const demand = await store.createDemand({
    goalId: goal.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: { kind: "userDayInterval", ...range },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (demand.status !== "accepted") throw new Error("demand");
  await store.setDemandResourceFootprintAssociation({
    demandId: demand.value.id,
    selection: { kind: "productiveOnly" },
  });
  return { store, durable, demandId: demand.value.id };
}
async function acceptWithoutRealization() {
  const setup = await start(),
    { store, durable } = setup;
  const evaluated = await store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at });
  if (evaluated.status !== "evaluated") throw new Error("evaluation");
  const generated = store.deriveProposal({
    allocation: evaluated.allocation.allocations[0]!,
    horizon: range,
    allocationHorizon: range,
    generatedAt: at,
    evaluationCutoff: at,
  });
  if (generated.status !== "proposed") throw new Error(JSON.stringify(generated));
  // Install a valid acceptance through the existing authority ingress, without the UI's
  // optional automatic realization callback. This is also the backup/restart case.
  const proposals = createProposalSurface({ storage: durable, now: () => at });
  await proposals.initializeProposals();
  await proposals.recordProposal(generated);
  const accepted = await proposals.acceptProposalOption({
    proposalId: generated.proposal.id,
    proposalRevision: generated.proposal.revision,
    optionId: generated.proposal.preferredOptionId,
    current: generated,
  });
  if (accepted.status !== "accepted") throw new Error(JSON.stringify(accepted));
  expect((await store.replaceProposalAuthority(proposals.exportProposalAuthority())).status).toBe(
    "accepted",
  );
  return { ...setup, accepted: accepted.value.acceptedAllocation, evaluated, generated };
}
it("realizes accepted work when the current Sleep foundation still fits", async () => {
  const { store, accepted } = await acceptWithoutRealization();
  expect(store.listRealizedScheduleFacts()).toEqual([]);
  expect((await store.realizeAcceptedAllocation(accepted.id)).status).toBe("realized");
  expect(store.listRealizedScheduleFacts()).toHaveLength(1);
  expect((await store.realizeAcceptedAllocation(accepted.id)).status).toBe("alreadyRealized");
});
it("preserves acceptance and rejects newly overlapping realization after Sleep changes", async () => {
  const { store, accepted, evaluated } = await acceptWithoutRealization();
  const saved = store.exportProposalAuthority();
  author(store, {
    durationMinutes: 180,
    window: { kind: "clock", startClock: "00:00", endClock: "03:00" },
  });
  expect(store.exportProposalAuthority()).toEqual(saved);
  expect(await store.realizeAcceptedAllocation(accepted.id)).toMatchObject({
    status: "inapplicable",
    reasons: ["sleepFoundationReviewRequired"],
  });
  expect(store.listRealizedScheduleFacts()).toEqual([]);
  expect(store.exportProposalAuthority().acceptedAllocations).toEqual(saved.acceptedAllocations);
  expect(
    store.deriveProposal({
      allocation: evaluated.allocation.allocations[0]!,
      horizon: range,
      allocationHorizon: range,
      generatedAt: at,
    }),
  ).toMatchObject({ status: "noProposal", result: { reasons: [{ code: "incompleteInput" }] } });
});
it("retains existing realized work, then fails planning closed when new Sleep conflicts", async () => {
  const { store, accepted, demandId } = await acceptWithoutRealization();
  expect((await store.realizeAcceptedAllocation(accepted.id)).status).toBe("realized");
  const facts = store.exportRealizationAuthority(),
    proposals = store.exportProposalAuthority();
  author(store, {
    durationMinutes: 180,
    window: { kind: "clock", startClock: "00:00", endClock: "03:00" },
  });
  const capacity = await store.queryCapacity(range);
  expect(capacity.status).toBe("derived");
  if (capacity.status !== "derived") return;
  expect(capacity.capacity.foundation?.sleep.status).toBe("infeasible");
  expect(capacity.capacity.qualification.allocability).toBe("nonAllocatable");
  expect(
    await evaluatePlanningRequest(store, { ...range, demandId, evaluationCutoff: at }),
  ).toMatchObject({ status: "blocked", reason: "sleepFoundationNonAllocatable" });
  expect(store.exportRealizationAuthority()).toEqual(facts);
  expect(store.exportProposalAuthority()).toEqual(proposals);
});
it("queries are fresh, Preview-independent, deterministic and non-persisting", async () => {
  const { store, demandId } = await start();
  expect(store.getState().preview).toBeNull();
  const backup = await store.exportBackupV13(at),
    snapshot = store.getState(),
    raw = [...storage.values];
  const writes = vi.spyOn(storage, "setItem");
  const first = await store.queryCapacity(range);
  expect(await store.queryCapacity(range)).toEqual(first);
  await store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at });
  expect(store.getState()).toEqual(snapshot);
  expect([...storage.values]).toEqual(raw);
  expect(writes).not.toHaveBeenCalled();
  expect(await store.exportBackupV13(at)).toEqual(backup);
  store.setPreviewRange({ preset: "custom", startDate: "2026-10-01", endDate: "2026-10-02" });
  expect(await store.queryCapacity(range)).toEqual(first);
  author(store, { durationMinutes: 60 });
  const second = await store.queryCapacity(range);
  expect(second).not.toEqual(first);
  if (first.status !== "derived" || second.status !== "derived") throw new Error("capacity");
  expect(await store.evaluateGoalDemandFeasibility({ demandId, capacity: first.capacity })).toEqual(
    await store.evaluateGoalDemandFeasibility({ demandId, capacity: second.capacity }),
  );
});
it("production protected authority blocks Capacity and constructive planning even without a Preview", async () => {
  storage.setItem(
    "dayframe-active-v2",
    JSON.stringify({ app: "DayFrame", surface: "active", version: 999 }),
  );
  const store = createDayFrameStore();
  await store.whenReady();
  const result = await store.queryCapacity(range);
  expect(result).toMatchObject({
    status: "derived",
    capacity: {
      foundation: { status: "nonAllocatable", sleep: { status: "protected" } },
      qualification: { allocability: "nonAllocatable" },
    },
  });
  expect(
    await evaluatePlanningRequest(store, {
      ...range,
      demandId: "none" as never,
      evaluationCutoff: at,
    }),
  ).toMatchObject({ status: "blocked" });
});
it("no active demand is distinct from a foundation-blocked planning request", async () => {
  const { store } = await start();
  expect(
    await evaluatePlanningRequest(store, {
      ...range,
      demandId: "none" as never,
      evaluationCutoff: at,
    }),
  ).toMatchObject({ status: "demandUnavailable" });
  author(store, { durationMinutes: 180 });
  expect(
    await evaluatePlanningRequest(store, {
      ...range,
      demandId: "none" as never,
      evaluationCutoff: at,
    }),
  ).toMatchObject({ status: "blocked" });
});

it("unresolved Preview reports unknown coverage and typed blocking Sleep Friction without publication", async () => {
  const { store } = await start();
  store.setShiftDefinitions([
    {
      id: "day",
      userId: "u",
      name: "Day",
      startTime: "09:00",
      endTime: "17:00",
      crossesMidnight: false,
      workDays: ["thursday"],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  store.setShiftCycles([
    {
      id: "cycle",
      userId: "u",
      name: "Cycle",
      type: "fixedSegments",
      startsOnDate: "2026-09-01",
      endsOnDate: "2026-09-30",
      segments: [
        {
          id: "segment",
          shiftCycleId: "cycle",
          shiftDefinitionId: "day",
          startsOnDate: "2026-09-01",
          endsOnDate: "2026-09-30",
        },
      ],
      createdAt: at,
      updatedAt: at,
    },
  ]);
  author(store, { durationMinutes: 180 });
  store.generatePreview({
    rangeStartDate: range.startUserDayDate,
    rangeEndDate: range.startUserDayDate,
    planningWindowStart: new Date("2026-09-17T00:00:00"),
    planningWindowEnd: new Date("2026-09-18T00:00:00"),
    generatedAt: at,
  });
  expect(store.getState().preview!.result.foundation?.sleep.status).toBe("infeasible");
  expect(store.getState().preview!.result.frictionPoints).toMatchObject([
    { kind: "sleep", canIgnore: false, sleepEvidence: { kind: "provenIncompatibility" } },
  ]);
  const review = await store.queryPlanningReview({
    reviewScope: createReviewScope({
      kind: "day",
      anchorUserDayDate: range.startUserDayDate,
      weekStartsOn: "monday",
    }),
    historyAsOf: at,
  });
  expect(review.planningDataCoverage).toBe("unknown");
  expect(publicationBlockers(review)).toContain("planningCoverageIncomplete");
});

it("accepted Sleep placement preserves Goal acceptance but freshly blocks overlapping realization", async () => {
  const { store, accepted } = await acceptWithoutRealization();
  author(store, { window: { kind: "clock", startClock: "00:00", endClock: "08:00" } });
  const r = await store.resolveRequiredSleep({ ownerRange: range });
  if (r.status !== "satisfied") throw new Error(JSON.stringify(r));
  const before = store.exportProposalAuthority();
  const t = store.trySleepPlacement({
    ownerRange: range,
    target: r.occurrences.find((o) => o.membership === "requested")!.reference,
    sleepStart: new Date("2026-09-17T01:00:00").toISOString(),
  });
  expect(t.status).toBe("available");
  if (t.status !== "available") return;
  expect(store.acceptPlanDecision(t.candidate).status).toBe("accepted");
  expect(store.exportProposalAuthority()).toEqual(before);
  expect(await store.realizeAcceptedAllocation(accepted.id)).toMatchObject({
    status: "inapplicable",
    reasons: ["sleepFoundationReviewRequired"],
  });
  expect(store.listRealizedScheduleFacts()).toEqual([]);
  expect(store.removePlanDecision(store.getPlanDecisions()[0]!.id).status).toBe("removed");
  expect((await store.realizeAcceptedAllocation(accepted.id)).status).toBe("realized");
});

it("realization between Sleep Try and Accept invalidates freshness without moving facts", async () => {
  const { store, accepted } = await acceptWithoutRealization();
  author(store, { window: { kind: "clock", startClock: "00:00", endClock: "08:00" } });
  const r = await store.resolveRequiredSleep({ ownerRange: range });
  if (r.status !== "satisfied") throw new Error(JSON.stringify(r));
  const t = store.trySleepPlacement({
    ownerRange: range,
    target: r.occurrences.find((o) => o.membership === "requested")!.reference,
    sleepStart: new Date("2026-09-17T01:00:00").toISOString(),
  });
  if (t.status !== "available") throw new Error(JSON.stringify(t));
  expect((await store.realizeAcceptedAllocation(accepted.id)).status).toBe("realized");
  const facts = store.exportRealizationAuthority(),
    goals = store.exportProposalAuthority();
  expect(store.acceptPlanDecision(t.candidate)).toMatchObject({
    status: "rejected",
    reason: "sleepPlacementReviewRequired",
  });
  expect(
    store.trySleepPlacement({
      ownerRange: range,
      target: t.candidate.target as never,
      sleepStart: t.candidate.payload.sleepStart,
    }).status,
  ).toBe("unavailable");
  expect(store.exportRealizationAuthority()).toEqual(facts);
  expect(store.exportProposalAuthority()).toEqual(goals);
});

it("accepted Sleep geometry reaches current Capacity, feasibility, allocation and Proposal", async () => {
  const { store, demandId } = await start();
  author(store, { window: { kind: "clock", startClock: "00:00", endClock: "08:00" } });
  const before = await store.queryCapacity(range),
    r = await store.resolveRequiredSleep({ ownerRange: range });
  if (r.status !== "satisfied") throw new Error();
  const t = store.trySleepPlacement({
    ownerRange: range,
    target: r.occurrences.find((o) => o.membership === "requested")!.reference,
    sleepStart: new Date("2026-09-17T02:00:00").toISOString(),
  });
  if (t.status !== "available") throw new Error();
  expect(store.acceptPlanDecision(t.candidate).status).toBe("accepted");
  expect(await store.queryCapacity(range)).not.toEqual(before);
  const planned = await evaluatePlanningRequest(store, {
    ...range,
    demandId,
    evaluationCutoff: at,
  });
  expect(planned.status).not.toBe("blocked");
  expect((await store.evaluateCompetingAllocation({ ...range, evaluationCutoff: at })).status).toBe(
    "evaluated",
  );
  author(store, { durationMinutes: 180 });
  expect(
    await evaluatePlanningRequest(store, { ...range, demandId, evaluationCutoff: at }),
  ).toMatchObject({ status: "blocked" });
});
