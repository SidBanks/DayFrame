import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { readFileSync } from "node:fs";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import {
  emptyGoalStructureAuthority,
  validateGoalStructureAuthority,
  type GoalStructureAuthorityV1,
} from "../core/planning/goalStructure.js";
import {
  evaluateGoalStructure,
  relationshipApplicability,
  structureEligibilityV1,
  structureEvaluationFreshness,
} from "../core/planning/goalStructureTemporal.js";
import { createDayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";
import { createGoalStructureSurface } from "./goalStructureSurface.js";
import { createLazyGoalStructureSurface } from "./lazyGoalStructureSurface.js";
import {
  createDayFrameDurableDb,
  GOAL_STRUCTURE_STORE,
} from "../infrastructure/storage/dayFrameDurableDb.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
import { createDayFrameStore } from "./dayFrameStore.js";

const goals: GoalV1[] = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
].map((id) => ({
  version: 1,
  id: id as GoalId,
  revision: 1,
  title: "Goal",
  status: "active",
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  links: [],
}));
const first = goals[0]!,
  second = goals[1]!;
const sep23 = "2026-09-23T12:00:00.000Z",
  sep24 = "2026-09-24T12:00:00.000Z",
  sep25 = "2026-09-25T12:00:00.000Z";
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => (resolve = r));
  return { promise, resolve };
}
async function fixture() {
  const db = createDayFrameDurableDb({ indexedDB: new IDBFactory(), name: crypto.randomUUID() });
  let time = sep23,
    allowed = true,
    epoch = 0;
  const clock = vi.fn(() => time);
  const options = {
    storage: db,
    getGoal: (id: GoalId) => goals.find((g) => g.id === id),
    listGoals: () => goals,
    now: clock,
    canMutate: () => allowed,
    getEpoch: () => epoch,
  };
  const owner = createGoalStructureSurface(options);
  await owner.initializeGoalStructure();
  return {
    owner,
    db,
    options,
    clock,
    setTime: (value: string) => (time = value),
    deny: () => (allowed = false),
    allow: () => (allowed = true),
    bump: () => epoch++,
  };
}
const edge = {
  kind: "dependsOn" as const,
  sourceGoalId: first.id,
  target: { kind: "goal" as const, goalId: second.id },
  semantics: {
    kind: "dependency" as const,
    strength: "hard" as const,
    condition: "goalCompleted" as const,
  },
};
function accepted<T>(r: { status?: string; value?: T }): T {
  expect(r.status).toBe("accepted");
  if (!r.value) throw Error("not accepted");
  return r.value;
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("rejects backward create/revise/retire without allocating or changing durability; no-op does not sample", async () => {
  const f = await fixture();
  const r = accepted(await f.owner.createRelationship(edge));
  const before = f.owner.exportGoalStructureAuthority();
  f.setTime("2026-09-22T00:00:00.000Z");
  for (const op of [
    () => f.owner.createMilestone({ ownerGoalId: first.id, title: "New" }),
    () =>
      f.owner.reviseRelationship(r.id, 1, {
        semantics: { ...edge.semantics, strength: "advisory" },
      }),
    () => f.owner.retireRelationship(r.id, 1),
  ])
    expect(await op()).toMatchObject({
      status: "rejected",
      reason: "invalidInput",
      detail: "clockBeforeRecordedAuthority",
    });
  f.clock.mockClear();
  expect(await f.owner.reviseRelationship(r.id, 1, {})).toMatchObject({
    status: "accepted",
    changed: false,
  });
  expect(f.clock).not.toHaveBeenCalled();
  expect(f.owner.exportGoalStructureAuthority()).toEqual(before);
  expect(f.owner.getGoalStructureDurabilityStatus()).toBe("durable");
  f.setTime(sep23);
  expect(await f.owner.retireRelationship(r.id, 1)).toMatchObject({
    status: "accepted",
    value: { effectiveFrom: sep23, effectiveTo: sep23 },
  });
});
it("rejects an invalid clock before identity allocation and permits empty-authority first write", async () => {
  const f = await fixture();
  const allocate = vi.fn(() => {
    throw Error("should not allocate");
  });
  const owner = createGoalStructureSurface({
    ...f.options,
    allocateId: allocate,
    now: () => "invalid",
  });
  await owner.initializeGoalStructure();
  expect(await owner.createRelationship(edge)).toMatchObject({ reason: "invalidInput" });
  expect(allocate).not.toHaveBeenCalled();
  expect((await f.owner.createRelationship(edge)).status).toBe("accepted");
});
it("preserves satisfied and retired timestamps through metadata/same-state edits and supports genuine transitions", async () => {
  const f = await fixture();
  let m = accepted(await f.owner.createMilestone({ ownerGoalId: first.id, title: "Checkpoint" }));
  f.setTime(sep24);
  m = accepted(await f.owner.reviseMilestone(m.id, 1, { state: "satisfied" }));
  const satisfied = structuredClone(m);
  f.setTime(sep25);
  m = accepted(await f.owner.reviseMilestone(m.id, 2, { title: "Renamed", state: "satisfied" }));
  expect(m).toMatchObject({ satisfiedAt: sep24, updatedAt: sep25 });
  expect(m).not.toHaveProperty("targetDate");
  expect(f.owner.getGoalStructureMilestoneRevision(m.id, 2)).toEqual({
    status: "resolved",
    milestone: satisfied,
  });
  m = accepted(await f.owner.reviseMilestone(m.id, 3, { targetDate: "2026-10-01" }));
  expect(m.satisfiedAt).toBe(sep24);
  m = accepted(await f.owner.reviseMilestone(m.id, 4, { targetDate: null, state: "retired" }));
  expect(m).not.toHaveProperty("targetDate");
  expect(m).not.toHaveProperty("satisfiedAt");
  const retiredAt = m.retiredAt;
  f.setTime("2026-09-26T00:00:00.000Z");
  m = accepted(await f.owner.reviseMilestone(m.id, 5, { title: "Retired rename" }));
  expect(m.retiredAt).toBe(retiredAt);
  m = accepted(await f.owner.reviseMilestone(m.id, 6, { state: "active" }));
  expect(m).not.toHaveProperty("retiredAt");
  expect(await f.owner.reviseMilestone(m.id, 7, { state: "active" })).toMatchObject({
    changed: false,
    value: { revision: 7 },
  });
  const restart = createGoalStructureSurface(f.options);
  await restart.initializeGoalStructure();
  expect(restart.exportGoalStructureAuthority()).toEqual(f.owner.exportGoalStructureAuthority());
});
it("does not retire a referenced Milestone or alter dependent history", async () => {
  const f = await fixture();
  const m = accepted(
    await f.owner.createMilestone({ ownerGoalId: second.id, title: "Checkpoint" }),
  );
  await f.owner.createRelationship({
    ...edge,
    target: { kind: "milestone", milestoneId: m.id },
    semantics: { ...edge.semantics, condition: "milestoneSatisfied" },
  });
  const before = f.owner.exportGoalStructureAuthority();
  expect(await f.owner.reviseMilestone(m.id, 1, { state: "retired" })).toMatchObject({
    status: "rejected",
    reason: "missingEndpoint",
  });
  expect(f.owner.exportGoalStructureAuthority()).toEqual(before);
});
it("preserves original anomalous latest and nonlatest legacy rows while protecting ordinary writes", async () => {
  const f = await fixture();
  const evidence = JSON.parse(
    readFileSync(
      "../docs/implementation/phase-9/evidence/task-9.27/contract-observations-RESULT.json",
      "utf8",
    ),
  );
  const legacy: GoalStructureAuthorityV1 = {
    version: 1,
    relationships: [
      evidence.futureInterval.relationship,
      evidence.reversedInterval.retirement.value,
    ],
    milestones: [],
  };
  // A later coherent revision cannot hide the anomalous retained earlier row.
  legacy.relationships.push({
    ...legacy.relationships[1]!,
    revision: 3 as never,
    updatedAt: "2026-10-02T00:00:00.000Z",
    effectiveTo: "2026-10-02T00:00:00.000Z",
  });
  expect(validateGoalStructureAuthority(legacy, goals).status).toBe("valid");
  await f.db.putMany(GOAL_STRUCTURE_STORE, legacy.relationships);
  const owner = createGoalStructureSurface(f.options);
  await owner.initializeGoalStructure();
  expect(owner.exportGoalStructureAuthority()).toEqual(legacy);
  expect(owner.getGoalStructureIngressStatus()).toEqual({ status: "accepted" });
  expect(owner.getGoalStructureQualification()).toMatchObject({ status: "protected" });
  expect(owner.getStructuralEligibility(first.id).status).toBe("unknown");
  expect(await owner.retryGoalStructurePersistence()).toMatchObject({
    status: "rejected",
    reason: "protected",
  });
  expect(await owner.createRelationship(edge)).toMatchObject({ reason: "protected" });
  expect(owner.getGoalStructureRelationshipRevision(legacy.relationships[1]!.id, 2)).toEqual({
    status: "resolved",
    relationship: legacy.relationships[1],
  });
});
it.each([
  "create",
  "revise",
  "retire",
  "milestone",
  "milestoneRevise",
  "retry",
  "replace",
  "clear",
] as const)("denies %s without writes or durability changes", async (kind) => {
  const f = await fixture();
  const r = accepted(await f.owner.createRelationship(edge));
  const m = accepted(await f.owner.createMilestone({ ownerGoalId: first.id, title: "M" }));
  const before = f.owner.exportGoalStructureAuthority();
  const mutate = vi.spyOn(f.db, "mutate");
  f.deny();
  const ops = {
    create: () => f.owner.createRelationship(edge),
    revise: () => f.owner.reviseRelationship(r.id, 1, {}),
    retire: () => f.owner.retireRelationship(r.id, 1),
    milestone: () => f.owner.createMilestone({ ownerGoalId: first.id, title: "M2" }),
    milestoneRevise: () => f.owner.reviseMilestone(m.id, 1, { title: "X" }),
    retry: () => f.owner.retryGoalStructurePersistence(),
    replace: () => f.owner.replaceGoalStructureAuthority(before),
    clear: () => f.owner.clearGoalStructure(),
  };
  expect(await ops[kind]()).toMatchObject({
    status: "rejected",
    reason: "authorityTransactionActive",
  });
  expect(mutate).not.toHaveBeenCalled();
  expect(f.owner.exportGoalStructureAuthority()).toEqual(before);
  expect(f.owner.getGoalStructureDurabilityStatus()).toBe("durable");
});
it("checks optional storage admission after asynchronous opening and leaves unrelated callers unchanged", async () => {
  const f = await fixture();
  f.db.close();
  let allowed = true;
  const pending = f.db.mutate([{ type: "clear", store: GOAL_STRUCTURE_STORE }], () => allowed);
  allowed = false;
  expect(await pending).toMatchObject({ status: "failure", error: { code: "admissionDenied" } });
  expect(await f.db.mutate([{ type: "clear", store: GOAL_STRUCTURE_STORE }])).toMatchObject({
    status: "success",
  });
});
it("rejects a call displaced during lazy loading even after the epoch becomes inactive", async () => {
  const f = await fixture();
  const lazy = createLazyGoalStructureSurface(f.options);
  const pending = lazy.createRelationship(edge);
  f.bump();
  expect(await pending).toMatchObject({ status: "rejected", detail: "contextReplaced" });
  expect(lazy.exportGoalStructureAuthority().relationships).toEqual([]);
});
it("retains accepted identity under storage throw and releases lease for exact retry", async () => {
  const f = await fixture();
  const spy = vi.spyOn(f.db, "mutate").mockRejectedValueOnce(Error("storage"));
  const r = accepted(await f.owner.createRelationship(edge));
  expect(f.owner.isGoalStructureQuiescent()).toBe(true);
  expect(f.owner.getGoalStructureDurabilityStatus()).toBe("storageFailure");
  spy.mockRestore();
  expect(await f.owner.retryGoalStructurePersistence()).toEqual({ status: "durable" });
  expect(
    f.owner.exportGoalStructureAuthority().relationships.map((x) => [x.id, x.revision]),
  ).toEqual([[r.id, 1]]);
});
it("denies a delayed write and protects displaced runtime rather than overwriting installed data", async () => {
  const f = await fixture();
  const gate = deferred();
  const original = f.db.mutate;
  vi.spyOn(f.db, "mutate").mockImplementation(async (rows, admit) => {
    await gate.promise;
    return original(rows, admit);
  });
  const pending = f.owner.createRelationship(edge);
  expect(f.owner.isGoalStructureQuiescent()).toBe(false);
  expect(await f.owner.createRelationship(edge)).toMatchObject({ detail: "ownerPersistenceBusy" });
  f.bump();
  f.owner.getRuntimeAuthorityAdapter(capability).installRuntimeExact({
    authority: emptyGoalStructureAuthority(),
    desired: emptyGoalStructureAuthority(),
    ingress: { status: "accepted" },
    durability: "durable",
  });
  gate.resolve();
  expect(await pending).toMatchObject({ status: "accepted", persistence: "pending" });
  expect(await f.db.getAll(GOAL_STRUCTURE_STORE)).toEqual({ status: "success", value: [] });
  expect(f.owner.exportGoalStructureAuthority()).toEqual(emptyGoalStructureAuthority());
  expect(f.owner.getGoalStructureIngressStatus().status).toBe("protected");
  expect(f.owner.isGoalStructureQuiescent()).toBe(true);
});
it("real store controller and clear reject before snapshot while persistence is outstanding", async () => {
  vi.stubGlobal("indexedDB", new IDBFactory());
  const db = createDayFrameDurableDb();
  const store = createDayFrameStore({}, { restoreIndexedDb: db });
  await store.whenReady();
  const a = await store.createGoal({ title: "A" }),
    b = await store.createGoal({ title: "B" });
  if (a.status !== "accepted" || b.status !== "accepted") throw Error("fixture");
  const runtime = getDayFrameRuntimeAuthorityController(store, capability);
  const gate = deferred();
  const original = db.mutate;
  vi.spyOn(db, "mutate").mockImplementation(async (rows, admit) => {
    if (rows.some((r) => r.store === GOAL_STRUCTURE_STORE)) await gate.promise;
    return original(rows, admit);
  });
  const pending = store.createRelationship({
    ...edge,
    sourceGoalId: a.goal.id,
    target: { kind: "goal", goalId: b.goal.id },
  });
  await vi.waitFor(() => expect(store.isGoalStructureQuiescent()).toBe(false));
  const epoch = runtime.getEpoch!();
  expect(runtime.begin("restore")).toEqual({ status: "busy" });
  expect(runtime.begin("internalReplacement")).toEqual({ status: "busy" });
  expect(runtime.getEpoch!()).toBe(epoch);
  await expect(store.clearLocalData()).rejects.toThrow("authorityTransactionActive");
  gate.resolve();
  expect(await pending).toMatchObject({ status: "accepted", persistence: "durable" });
  expect(runtime.begin("restore").status).toBe("begun");
  expect(runtime.abort().status).toBe("aborted");
  expect((await store.clearLocalData()).authorities.goalStructure.status).toBe("removed");
});
it("coordinator clear requires the matching capability and active epoch", async () => {
  const f = await fixture();
  await expect(f.owner.clearGoalStructureForCoordinator(Symbol(), 0)).rejects.toThrow();
  await expect(f.owner.clearGoalStructureForCoordinator(capability, 0)).rejects.toThrow();
});

it("canonical applicability distinguishes boundaries, retired records and unknown intervals", async () => {
  const f = await fixture();
  const r = accepted(await f.owner.createRelationship(edge));
  for (const [at, position] of [
    ["2026-09-22T00:00:00.000Z", "beforeStart"],
    [sep23, "inside"],
    [sep24, "inside"],
  ])
    expect(relationshipApplicability(r, at!).intervalPosition).toBe(position);
  const ended = { ...r, status: "retired" as const, effectiveTo: sep24 };
  expect(relationshipApplicability(ended, sep23)).toMatchObject({
    intervalPosition: "inside",
    applicability: "notApplicable",
    reason: "retired",
  });
  expect(relationshipApplicability(ended, sep24).intervalPosition).toBe("atOrAfterEnd");
  expect(relationshipApplicability(ended, sep25).applicability).toBe("notApplicable");
  expect(relationshipApplicability({ ...ended, effectiveTo: sep23 }, sep23).intervalPosition).toBe(
    "empty",
  );
  expect(
    relationshipApplicability({ ...ended, effectiveTo: "2026-09-01T00:00:00.000Z" }, sep23)
      .applicability,
  ).toBe("unknown");
});
it("pure mapping samples no clock and time-only membership and rollback affect freshness", async () => {
  const f = await fixture();
  await f.owner.createRelationship(edge);
  const authority = f.owner.exportGoalStructureAuthority();
  const query = (at: string) =>
    evaluateGoalStructure(
      { goalId: first.id, evaluationInstant: at, basis: "currentAuthority" },
      authority,
      goals,
    );
  const before = query("2026-09-22T00:00:00.000Z"),
    at = query(sep23);
  f.clock.mockClear();
  expect(structureEligibilityV1(before, first.id).status).toBe("eligible");
  expect(structureEligibilityV1(at, first.id).status).toBe("ineligible");
  expect(f.clock).not.toHaveBeenCalled();
  expect(structureEvaluationFreshness(before, at)).toBe("stale");
  expect(structureEvaluationFreshness(at, query(sep24))).toBe("current");
  expect(structureEvaluationFreshness(at, before)).toBe("unknown");
  if (before.status === "evaluated") expect(before.value.nextApplicabilityChangeAt).toBe(sep23);
  f.owner.getStructuralEligibility(first.id);
  expect(f.clock).toHaveBeenCalledTimes(1);
});
it("distinguishes qualified empty authority, unavailable ingress, protected temporal evidence and unsupported history", () => {
  const input = { goalId: first.id, evaluationInstant: sep23, basis: "currentAuthority" as const };
  const a = emptyGoalStructureAuthority();
  expect(evaluateGoalStructure(input, a, goals)).toMatchObject({
    status: "evaluated",
    value: {
      qualification: "qualified",
      eligibility: "eligible",
      records: { status: "available", values: [] },
    },
  });
  const unavailable = evaluateGoalStructure(input, a, goals, "protected");
  expect(unavailable).toMatchObject({
    value: { eligibility: "unknown", records: { status: "unavailable" } },
  });
  if (unavailable.status === "evaluated")
    expect(unavailable.value).not.toHaveProperty("authorityFingerprint");
  expect(evaluateGoalStructure({ ...input, basis: "historical" as never }, a, goals)).toEqual({
    status: "unavailable",
    reason: "historicalReconstructionUnsupported",
  });
});

it("future-effective retirement rejects before start without changing retained authority", async () => {
  const f = await fixture();
  const r = accepted(await f.owner.createRelationship(edge));
  const future = f.owner.exportGoalStructureAuthority();
  future.relationships[0]!.effectiveFrom = sep25;
  expect(await f.owner.replaceGoalStructureAuthority(future)).toMatchObject({ status: "accepted" });
  f.setTime(sep24);
  expect(await f.owner.retireRelationship(r.id, 1)).toMatchObject({
    status: "rejected",
    detail: "retirementBeforeEffectiveStart",
  });
  expect(f.owner.exportGoalStructureAuthority()).toEqual(future);
});
it("initialization cannot install a delayed read over a newer runtime generation", async () => {
  const f = await fixture();
  const gate = deferred();
  const read = f.db.getAll;
  vi.spyOn(f.db, "getAll").mockImplementation(async (store) => {
    const result = await read(store);
    await gate.promise;
    return result;
  });
  const owner = createGoalStructureSurface(f.options);
  const pending = owner.initializeGoalStructure();
  owner.getRuntimeAuthorityAdapter(capability).installRuntimeExact({
    authority: emptyGoalStructureAuthority(),
    desired: emptyGoalStructureAuthority(),
    ingress: { status: "protected", reason: "invalidAuthority" },
    durability: "storageFailure",
  });
  gate.resolve();
  expect(await pending).toEqual({ status: "protected" });
  expect(owner.getGoalStructureIngressStatus()).toEqual({
    status: "protected",
    reason: "invalidAuthority",
  });
  expect(await owner.initializeGoalStructure()).toEqual({ status: "protected" });
});
it("already-started storage settles while the owner remains leased until acknowledgement", async () => {
  const f = await fixture();
  const gate = deferred(),
    committed = deferred();
  const write = f.db.mutate;
  vi.spyOn(f.db, "mutate").mockImplementation(async (rows, admit) => {
    const result = await write(rows, admit);
    committed.resolve();
    await gate.promise;
    return result;
  });
  const pending = f.owner.createRelationship(edge);
  await committed.promise;
  expect(f.owner.isGoalStructureQuiescent()).toBe(false);
  const stored = await f.db.getAll(GOAL_STRUCTURE_STORE);
  expect(stored.status === "success" && stored.value.length).toBe(1);
  expect(await f.owner.clearGoalStructure()).toMatchObject({
    status: "rejected",
    detail: "ownerPersistenceBusy",
  });
  gate.resolve();
  expect(await pending).toMatchObject({ status: "accepted", persistence: "durable" });
  expect(f.owner.isGoalStructureQuiescent()).toBe(true);
});
it("canonical aggregate precedence preserves hard, advisory and manual Milestone conditions", async () => {
  const f = await fixture();
  const r = accepted(await f.owner.createRelationship(edge));
  const query = (authority: GoalStructureAuthorityV1, currentGoals = goals) =>
    structureEligibilityV1(
      evaluateGoalStructure(
        { goalId: first.id, evaluationInstant: sep23, basis: "currentAuthority" },
        authority,
        currentGoals,
      ),
      first.id,
    ).status;
  const a = f.owner.exportGoalStructureAuthority();
  expect(query(a)).toBe("ineligible");
  a.relationships[0]!.semantics = { ...edge.semantics, strength: "advisory" };
  expect(query(a)).toBe("conditionallyEligible");
  expect(
    query(
      a,
      goals.map((g) => (g.id === second.id ? { ...g, status: "completed" } : g)),
    ),
  ).toBe("eligible");
  a.relationships.push({
    ...r,
    id: "33333333-3333-4333-8333-333333333333" as never,
    target: { kind: "goal", goalId: "44444444-4444-4444-8444-444444444444" as GoalId },
  });
  a.relationships[0]!.semantics = edge.semantics;
  expect(
    query(a, [
      ...goals,
      { ...second, id: "44444444-4444-4444-8444-444444444444" as GoalId, status: "archived" },
    ]),
  ).toBe("unknown");
  a.relationships.reverse();
  expect(
    query(a, [
      ...goals,
      { ...second, id: "44444444-4444-4444-8444-444444444444" as GoalId, status: "archived" },
    ]),
  ).toBe("unknown");
  const m = accepted(await f.owner.createMilestone({ ownerGoalId: second.id, title: "Manual" }));
  await f.owner.retireRelationship(r.id, 1);
  await f.owner.createRelationship({
    ...edge,
    target: { kind: "milestone", milestoneId: m.id },
    semantics: { kind: "dependency", strength: "hard", condition: "milestoneSatisfied" },
  });
  expect(f.owner.getStructuralEligibility(first.id).status).toBe("ineligible");
  await f.owner.reviseMilestone(m.id, 1, { state: "satisfied" });
  expect(f.owner.getStructuralEligibility(first.id).status).toBe("eligible");
});

it.each(["replace", "clear"] as const)(
  "%s keeps its lease through runtime installation notifications",
  async (operation) => {
    const f = await fixture();
    const owner = createGoalStructureSurface({
      ...f.options,
      notificationScheduler: createDayFrameNotificationScheduler(),
    });
    await owner.initializeGoalStructure();
    await owner.createRelationship(edge);
    const observations: boolean[] = [];
    owner.subscribeGoalStructure(() => observations.push(owner.isGoalStructureQuiescent()));
    if (operation === "replace")
      expect(
        await owner.replaceGoalStructureAuthority(emptyGoalStructureAuthority()),
      ).toMatchObject({ status: "accepted" });
    else expect(await owner.clearGoalStructure()).toMatchObject({ status: "removed" });
    expect(observations).toEqual([false]);
    expect(owner.isGoalStructureQuiescent()).toBe(true);
    expect(owner.exportGoalStructureAuthority()).toEqual(emptyGoalStructureAuthority());
  },
);
