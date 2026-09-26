/* @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { createDayFrameStore } from "./dayFrameStore.js";
import { goalInspectionCanonicalFixture } from "../ui/tests/goalInspectionCanonicalFixture.js";
import { evaluateDemandProjectionFreshness } from "../core/planning/goalDemandProjection.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { queryGoalDemandProjection } from "./goalDemandProjectionQuery.js";
import { createProposalSurface } from "./proposalSurface.js";
import { structureEligibilityV1 } from "../core/planning/goalStructureTemporal.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-23T12:00:00.000Z"));
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function fixture() {
  const f = await goalInspectionCanonicalFixture();
  const store = f.store;
  const goal = await store.createGoal({ title: "Temporal planning" });
  if (goal.status !== "accepted") throw Error("goal");
  const target = await store.createGoal({ title: "Prerequisite" });
  if (target.status !== "accepted") throw Error("target");
  const d = await store.createDemand({
    goalId: goal.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: {
      kind: "userDayInterval",
      startUserDayDate: "2026-09-24",
      endUserDayDateExclusive: "2026-09-25",
    },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "target", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (d.status !== "accepted") throw Error("demand");
  await store.setDemandResourceFootprintAssociation({
    demandId: d.value.id,
    selection: { kind: "productiveOnly" },
  });
  return { store, goal: goal.goal, target: target.goal, demand: d.value };
}
const horizon = {
  startUserDayDate: "2026-09-24" as const,
  endUserDayDateExclusive: "2026-09-25" as const,
};
async function proposal(f: Awaited<ReturnType<typeof fixture>>) {
  const evaluation = await f.store.evaluateCompetingAllocation({
    ...horizon,
    evaluationCutoff: new Date().toISOString(),
  });
  if (evaluation.status !== "evaluated") throw Error("evaluate");
  const allocation = evaluation.allocation.allocations[0]!;
  const result = await f.store.deriveProposal({
    allocation,
    horizon,
    allocationHorizon: horizon,
    generatedAt: new Date().toISOString(),
    evaluationCutoff: new Date().toISOString(),
  });
  if (result.status !== "proposed") throw Error(JSON.stringify(result));
  await f.store.recordProposal(result);
  return result.proposal;
}
it("single captured planning instant bypasses the legacy clock-sampling wrapper and later equivalent acceptance succeeds", async () => {
  const f = await fixture();
  const legacy = vi.spyOn(f.store, "getStructuralEligibility");
  const p = await proposal(f);
  expect(legacy).not.toHaveBeenCalled();
  const old = f.store.exportProposalAuthority().acceptedAllocations;
  vi.setSystemTime(new Date("2026-09-23T12:00:01.000Z"));
  expect(
    await f.store.acceptProposalOption({
      proposalId: p.id,
      proposalRevision: p.revision,
      optionId: p.preferredOptionId,
    }),
  ).toMatchObject({ status: "accepted" });
  expect(f.store.exportProposalAuthority().acceptedAllocations.slice(0, old.length)).toEqual(old);
});
it("time-only advisory membership change stales acceptance even with unchanged requested minutes", async () => {
  const f = await fixture();
  const e = await f.store.createRelationship({
    kind: "dependsOn",
    sourceGoalId: f.goal.id,
    target: { kind: "goal", goalId: f.target.id },
    semantics: { kind: "dependency", strength: "advisory", condition: "goalCompleted" },
  });
  if (e.status !== "accepted") throw Error("edge");
  const authority = f.store.exportGoalStructureAuthority();
  authority.relationships.find((r) => r.id === e.value.id)!.effectiveFrom =
    "2026-09-23T13:00:00.000Z";
  expect(await f.store.replaceGoalStructureAuthority(authority)).toMatchObject({
    status: "accepted",
  });
  const projected = await f.store.projectGoalDemand(
    f.demand.id,
    undefined,
    new Date().toISOString(),
  );
  if (projected.status !== "projected") throw Error("projection");
  const p = await proposal(f);
  const before = f.store.exportProposalAuthority().acceptedAllocations;
  vi.setSystemTime(new Date("2026-09-23T13:00:00.000Z"));
  const current = await f.store.projectGoalDemand(f.demand.id, undefined, new Date().toISOString());
  if (current.status !== "projected") throw Error("projection");
  expect(current.projection.requestedEffort).toEqual(projected.projection.requestedEffort);
  expect(current.projection.semanticId).not.toBe(projected.projection.semanticId);
  const q = f.store.queryGoalStructure({
    goalId: f.goal.id,
    evaluationInstant: new Date().toISOString(),
    basis: "currentAuthority",
  });
  expect(
    evaluateDemandProjectionFreshness(projected.projection, {
      goal: f.goal,
      demand: f.demand,
      structuralEligibility: structureEligibilityV1(q, f.goal.id),
    }).status,
  ).toBe("stale");
  expect(
    await f.store.acceptProposalOption({
      proposalId: p.id,
      proposalRevision: p.revision,
      optionId: p.preferredOptionId,
    }),
  ).toMatchObject({ status: "rejected", reason: "stale" });
  expect(f.store.exportProposalAuthority().acceptedAllocations).toEqual(before);
});
it("V14 preserves legacy anomalies across exact restore, export and reinitialization; planning is unknown", async () => {
  const f = await fixture();
  const e = await f.store.createRelationship({
    kind: "dependsOn",
    sourceGoalId: f.goal.id,
    target: { kind: "goal", goalId: f.target.id },
    semantics: { kind: "dependency", strength: "hard", condition: "goalCompleted" },
  });
  if (e.status !== "accepted") throw Error("edge");
  const exported = await f.store.exportBackupV14(new Date().toISOString());
  if (exported.status !== "exported") throw Error(JSON.stringify(exported));
  const backup = structuredClone(exported.backup);
  const row = backup.data.goalStructure.relationships.find((r) => r.id === e.value.id)!;
  backup.data.goalStructure.relationships.push({
    ...row,
    revision: 2 as never,
    status: "retired",
    updatedAt: "2026-09-22T00:00:00.000Z",
    effectiveTo: "2026-09-22T00:00:00.000Z",
  });
  expect(await f.store.importBackupFile(backup)).toMatchObject({ status: "restoredV14" });
  expect(f.store.getGoalStructureQualification().status).toBe("protected");
  expect(f.store.getStructuralEligibility(f.goal.id).status).toBe("unknown");
  expect(await f.store.retryGoalStructurePersistence()).toMatchObject({
    status: "rejected",
    reason: "protected",
  });
  const after = await f.store.exportBackupV14(new Date().toISOString());
  if (after.status !== "exported") throw Error("export");
  expect(after.backup.data.goalStructure).toEqual(backup.data.goalStructure);
  const restart = createDayFrameStore(undefined, { restoreIndexedDb: createDayFrameDurableDb() });
  await restart.whenReady();
  expect(restart.exportGoalStructureAuthority()).toEqual(backup.data.goalStructure);
  expect(restart.getGoalStructureQualification().status).toBe("protected");
  expect(restart.getReadiness().status).toBe("ready");
});
it("acceptance is denied while a restore transaction is active", async () => {
  const f = await fixture();
  const p = await proposal(f);
  const controller = getDayFrameRuntimeAuthorityController(
    f.store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  const begun = controller.begin("restore");
  expect(begun.status).toBe("begun");
  expect(
    await f.store.acceptProposalOption({
      proposalId: p.id,
      proposalRevision: p.revision,
      optionId: p.preferredOptionId,
    }),
  ).toMatchObject({ status: "rejected", reason: "authorityTransactionActive" });
  expect(controller.abort().status).toBe("aborted");
});

it("persisted proposals require and pass explicit current acceptance revalidation after reload", async () => {
  const f = await fixture();
  const exported = await f.store.exportBackupV14(new Date().toISOString());
  if (exported.status !== "exported") throw Error("export");
  expect(await f.store.importBackupFile(exported.backup)).toMatchObject({ status: "restoredV14" });
  const p = await proposal(f);
  const old = f.store.exportProposalAuthority().acceptedAllocations;
  vi.setSystemTime(new Date("2026-09-23T12:00:10.000Z"));
  const restart = createDayFrameStore(undefined, { restoreIndexedDb: createDayFrameDurableDb() });
  await restart.whenReady();

  expect(
    await restart.acceptProposalOption({
      proposalId: p.id,
      proposalRevision: p.revision,
      optionId: p.preferredOptionId,
    }),
  ).toMatchObject({ status: "accepted" });
  for (const accepted of old)
    expect(
      restart.exportProposalAuthority().acceptedAllocations.find((row) => row.id === accepted.id),
    ).toEqual(accepted);
  expect(restart.exportProposalAuthority().acceptedAllocations).toHaveLength(old.length + 1);
});

it("projection passes its captured instant exactly once and never invokes the legacy wrapper", async () => {
  const f = await fixture();
  const query = vi.fn(f.store.queryGoalStructure);
  const legacy = vi.fn(() => {
    throw Error("hidden clock sample");
  });
  const state = f.store.getState();
  const result = queryGoalDemandProjection({
    authority: f.store.exportGoalPlanningAuthority(),
    id: f.demand.id,
    getGoal: f.store.getGoal,
    getStructuralEligibility: legacy,
    queryGoalStructure: query,
    evaluationInstant: "2026-09-23T12:00:03.000Z",
    getUserDayResolver: () => ({
      shiftCycles: state.shiftCycles,
      defaultSchedulingPreferences: state.schedulingPreferences,
    }),
  });
  expect(result.status).toBe("projected");
  expect(query).toHaveBeenCalledExactlyOnceWith({
    goalId: f.goal.id,
    evaluationInstant: "2026-09-23T12:00:03.000Z",
    basis: "currentAuthority",
  });
  expect(legacy).not.toHaveBeenCalled();
});
it("a deferred acceptance cannot resume after exact runtime replacement", async () => {
  const f = await fixture();
  const p = await proposal(f);
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  let entered!: () => void;
  const started = new Promise<void>((r) => (entered = r));
  const owner = createProposalSurface({
    storage: createDayFrameDurableDb(),
    revalidate: async () => {
      entered();
      await gate;
      return { status: "proposed", proposal: p };
    },
  });
  await owner.initializeProposals();
  const pending = owner.acceptProposalOption({
    proposalId: p.id,
    proposalRevision: p.revision,
    optionId: p.preferredOptionId,
  });
  await started;
  const adapter = owner.getProposalRuntimeAdapter(DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY);
  const before = adapter.captureRuntimeSnapshot();
  adapter.installRuntimeExact(before);
  release();
  expect(await pending).toMatchObject({ status: "rejected", reason: "contextReplaced" });
  expect(owner.exportProposalAuthority()).toEqual(before.authority);
});

it("restore storage and installation reject a displaced coordinator epoch", async () => {
  const f = await fixture();
  const db = createDayFrameDurableDb();
  const store = createDayFrameStore(undefined, { restoreIndexedDb: db });
  await store.whenReady();
  const backup = await store.exportBackupV14(new Date().toISOString());
  if (backup.status !== "exported") throw Error("export");
  const before = store.exportGoalStructureAuthority();
  const controller = getDayFrameRuntimeAuthorityController(
    store,
    DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  );
  let release!: () => void, entered!: () => void;
  const gate = new Promise<void>((r) => (release = r)),
    started = new Promise<void>((r) => (entered = r));
  const write = db.mutate;
  vi.spyOn(db, "mutate").mockImplementation(async (ops, admit) => {
    if (ops.some((op) => op.store === "goalStructure" && op.type === "clear")) {
      entered();
      await gate;
    }
    return write(ops, admit);
  });
  const pending = store.importBackupFile(backup.backup);
  await started;
  expect(controller.abort().status).toBe("aborted");
  expect(controller.begin("restore").status).toBe("begun");
  const epoch = controller.getEpoch!();
  release();
  expect((await pending).status).not.toBe("restoredV14");
  expect(controller.getEpoch!()).toBe(epoch);
  expect(controller.getState().status).toBe("active");
  expect(store.exportGoalStructureAuthority()).toEqual(before);
  controller.abort();
  expect(f.store.exportGoalStructureAuthority()).toEqual(before);
});
