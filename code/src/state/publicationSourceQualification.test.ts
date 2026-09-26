import { expect, it, vi } from "vitest";
import { publicationFixture } from "./publicationSourceTestFixtures.js";
import { deferred } from "./acceptanceLifecycleTestFixtures.js";
import { publicationBlockers } from "./publicationEligibility.js";
import {
  checkReviewSources,
  proposalQualification,
  runtimeQualification,
  qualified,
  unqualified,
} from "./reviewSourceQualification.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability,
  getDayFrameRuntimeAuthorityController,
} from "./dayFrameRuntimeAuthority.js";
import { createAcceptanceLifecycle } from "./acceptanceLifecycle.js";
import { createLazyProposalSurface } from "./lazyProposalSurface.js";
import { createLazyRealizationSurface } from "./lazyRealizationSurface.js";
import { createLazyCompositionSurface } from "./lazyCompositionSurface.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";

it.each([
  ["durable", true, "verifiedCommitted"],
  ["storageFailure", true, "qualifiedPriorCommit"],
  ["storageFailure", false, "qualificationUnavailable"],
  ["unknown", false, "qualificationUnavailable"],
  ["pending", true, "pendingDurability"],
] as const)("Proposal %s requires actual prior-base proof %s", (durability, proof, expected) => {
  const q = proposalQualification({ status: "accepted" }, durability, {
    active: false,
    provenPriorCommit: proof,
  });
  expect(q.status === "qualified" ? q.basis : q.issue.reason).toBe(expected);
  expect(
    proposalQualification({ status: "accepted" }, durability, {
      active: true,
      provenPriorCommit: proof,
    }),
  ).toMatchObject({ issue: { reason: "writeInProgress" } });
});
it.each(["goal", "composition", "planDecision"] as const)(
  "%s accepted runtime preserves pending and failed durability",
  (source) => {
    for (const durability of ["pending", "storageFailure", "durable"])
      expect(runtimeQualification(source, { status: "accepted" }, durability).status).toBe(
        "qualified",
      );
    expect(runtimeQualification(source, { status: "protected", reason: "readFailure" })).toEqual(
      unqualified(source, "protected", "readFailure", true),
    );
  },
);
it("PlanDecision quarantine and missing/unavailable absence remain distinct", () => {
  expect(
    runtimeQualification("planDecision", { status: "accepted", quarantinedEntryCount: 1 }),
  ).toMatchObject({ issue: { reason: "coverageIncomplete", coverage: { status: "partial" } } });
  for (const reason of ["missing", "resolvedByAbandonment"])
    expect(runtimeQualification("planDecision", { status: "noSource", reason })).toEqual(
      qualified(),
    );
  expect(
    runtimeQualification("planDecision", { status: "noSource", reason: "storageUnavailable" }),
  ).toMatchObject({ issue: { reason: "readUnavailable" } });
});
it("observation invalidates synchronously without invalidating an operation receipt", () => {
  const life = createAcceptanceLifecycle(),
    origin = life.capture(),
    receipt = life.result({}, origin),
    tokens: object[] = [];
  life.observation.subscribe(() => tokens.push(life.observation.token()));
  expect(life.acquire(origin)).toBeUndefined();
  life.release(origin);
  expect(tokens).toHaveLength(2);
  expect(tokens[0]).not.toBe(tokens[1]);
  expect(receipt.receipt.isCurrent()).toBe(true);
});
it("lazy source subscriptions survive preconstruction install and module construction", async () => {
  const storage = createDayFrameDurableDb();
  const proposal = createLazyProposalSurface({ storage }),
    realization = createLazyRealizationSurface({
      storage,
      resolveAcceptedAllocation: () => ({ status: "notFound" }),
    }),
    composition = createLazyCompositionSurface({ storage, listSources: () => [] });
  const seen = vi.fn();
  proposal.subscribeProposals(seen);
  realization.getRealizationReviewEvidence().observation.subscribe(seen);
  composition.subscribeComposition(seen);
  const pa = proposal.getProposalRuntimeAdapter(capability),
    ra = realization.getRealizationRuntimeAdapter(capability),
    ca = composition.getCompositionRuntimeAdapter(capability);
  pa.installRuntimeExact({
    ...pa.captureRuntimeSnapshot(),
    ingress: { status: "accepted" },
    durability: "storageFailure",
  });
  expect(proposal.getProposalReviewEvidence().provenPriorCommit).toBe(false);
  ra.installRuntimeExact({ ...ra.captureRuntimeSnapshot(), ingress: "ready" });
  ca.installRuntimeExact({
    ...ca.captureRuntimeSnapshot(),
    ingress: { status: "accepted" },
    durability: "pending",
  });
  expect(seen.mock.calls.length).toBeGreaterThanOrEqual(3);
  expect(composition.getCompositionIngressStatus().status).toBe("accepted");
  const calls = seen.mock.calls.length;
  await Promise.all([
    proposal.initializeProposals(),
    realization.initializeRealizations(),
    composition.initializeComposition(),
  ]);
  expect(seen.mock.calls.length).toBeGreaterThan(calls);
  expect(proposal.getProposalReviewEvidence().provenPriorCommit).toBe(true);
});
it("healthy offers and qualified empty acceptance publish once; a fresh no-op preserves exact history", async () => {
  const f = await publicationFixture(),
    model = await f.store.queryPlanningReview(f.query);
  expect(model.version).toBe(2);
  expect(model.proposals.records.length).toBeGreaterThan(0);
  expect(model.acceptedLiabilities).toMatchObject({
    records: [],
    coverage: { status: "complete" },
  });
  expect(publicationBlockers(model)).toEqual([]);
  expect(model.publicationWitness.status).toBe("publishable");
  const input = await f.command();
  expect((await f.store.publishScheduleRange(input)).status).toBe("published");
  const before = await f.store.exportHistoricalPlan();
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("alreadyPublished");
  expect(f.counts()).toEqual({ attempts: 1, transactions: 1 });
  expect(await f.store.exportHistoricalPlan()).toEqual(before);
  expect((await f.store.queryPlanningReview(f.query)).sourceFingerprint).toBe(
    model.sourceFingerprint,
  );
  expect(checkReviewSources(structuredClone(model))).toMatchObject({
    reason: "publicationSourceUnqualified",
  });
});
it("known complete realization materializes all three roles with qualified Goal metadata", async () => {
  const f = await publicationFixture();
  expect((await f.store.acceptProposalOption(f.input)).status).toBe("accepted");
  f.generate();
  const review = await f.store.queryPlanningReview(f.query);
  expect(review.acceptedLiabilities.records).toEqual([]);
  expect(review.scheduledReality.records.map((row) => row.fact.scheduleRole).sort()).toEqual([
    "bufferProtection",
    "productiveGoalWork",
    "supportActivity",
  ]);
  expect(publicationBlockers(review)).toEqual([]);
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const history = await f.store.exportHistoricalPlan();
  expect(history.status).toBe("exported");
  expect(JSON.stringify(history)).toContain("Study");
  expect(f.counts().transactions).toBe(1);
});
it.each(["proposal", "realization", "goal", "composition"] as const)(
  "equal records with protected %s are never healthy absence",
  async (source) => {
    const f = await publicationFixture(),
      before = await f.store.queryPlanningReview(f.query);
    const controller = getDayFrameRuntimeAuthorityController(f.store, capability),
      snapshots = controller.captureAll();
    const key = {
      proposal: "proposals",
      realization: "realizations",
      goal: "goals",
      composition: "composition",
    }[source];
    const target = snapshots[key] as { ingress: unknown };
    expect(controller.begin().status).toBe("begun");
    expect(
      controller.install(key as "proposals", {
        ...target,
        ingress:
          source === "realization" ? "protected" : { status: "protected", reason: "readFailure" },
      }).status,
    ).toBe("installed");
    controller.commit();
    const model = await f.store.queryPlanningReview(f.query);
    expect(model.sourceQualification[source]).toMatchObject({
      status: "unqualified",
      issue: { source, reason: "protected" },
    });
    if (source === "composition" || source === "realization")
      expect(model.sourceQualification.sleepFoundation).toEqual(model.sourceQualification[source]);
    expect(model.publicationWitness.status).toBe("blocked");
    const result = await f.store.publishScheduleRange({
      ...(await f.command()),
      expectedSourceFingerprint: before.sourceFingerprint,
    });
    expect(result).toMatchObject({
      reason: "publicationSourceUnqualified",
      sourceIssues: expect.arrayContaining([
        expect.objectContaining({ source, reason: "protected" }),
      ]),
    });
    expect(f.counts().transactions).toBe(0);
  },
);
it("source mutation during awaited collection read returns explicitly stale Review, then a fresh query qualifies", async () => {
  const f = await publicationFixture(),
    entered = deferred(),
    release = deferred(),
    read = f.history.readReviewCollection;
  vi.spyOn(f.history, "readReviewCollection").mockImplementationOnce(async () => {
    const value = await read();
    entered.resolve();
    await release.promise;
    return value;
  });
  const query = f.store.queryPlanningReview(f.query);
  await entered.promise;
  const goal = f.store.listGoals()[0]!;
  await f.store.updateGoal(goal.id, goal.revision, { title: "Changed title" });
  release.resolve();
  const model = await query;
  expect(model.queryState).toBe("sourceChanged");
  expect(model.publicationWitness.status).toBe("blocked");
  expect(f.counts().transactions).toBe(0);
  expect((await f.store.queryPlanningReview(f.query)).queryState).toBe("current");
});
it("identical replacement and abort invalidate a late query origin before lazy dispatch", async () => {
  const f = await publicationFixture();
  const query = f.store.queryPlanningReview(f.query),
    controller = getDayFrameRuntimeAuthorityController(f.store, capability);
  expect(controller.begin().status).toBe("begun");
  expect(controller.abort().status).toBe("aborted");
  expect((await query).queryState).toBe("contextReplaced");
  expect((await f.store.queryPlanningReview(f.query)).queryState).toBe("current");
});
it("independent Actual and Progress protection do not become source prerequisites", async () => {
  const f = await publicationFixture(),
    controller = getDayFrameRuntimeAuthorityController(f.store, capability),
    snapshots = controller.captureAll();
  expect(controller.begin().status).toBe("begun");
  for (const key of ["executionHistory", "progressObservations"] as const) {
    const target = snapshots[key] as object;
    expect(
      controller.install(key, {
        ...target,
        ingress:
          key === "executionHistory"
            ? { status: "recoveryRequired", reason: "readFailure", sourcePreserved: true }
            : { status: "protected", reason: "readFailure" },
      }).status,
    ).toBe("installed");
  }
  controller.commit();
  expect(f.store.getExecutionHistoryIngressStatus().status).toBe("recoveryRequired");
  expect(f.store.getProgressObservationIngressStatus().status).toBe("protected");
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  expect(f.counts().transactions).toBe(1);
});
it.each(["knownAbort", "protectedPrior"] as const)(
  "%s retains earlier exact accepted liabilities without inferring complete absence",
  async (fault) => {
    const f = await publicationFixture(),
      mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
    vi.spyOn(f.durable, "mutate").mockImplementation((rows, admit, observe) =>
      mutate(
        rows,
        rows.some((row) => row.store === "realizationAuthority") ? () => false : admit,
        observe,
      ),
    );
    expect((await f.store.acceptProposalOption(f.input)).status).toBe("accepted");
    const accepted = f.store.exportProposalAuthority().acceptedAllocations;
    const older = f.store.listActionableProposals()[0]!;
    vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      const proposal = rows.some((row) => row.store === "proposalAuthority");
      const result = await mutate(
        proposal && fault === "knownAbort"
          ? [...rows, { type: "put", store: "proposalAuthority", value: { invalid: "no key" } }]
          : rows,
        admit,
        observe,
      );
      if (proposal && fault === "protectedPrior") throw Error("controlled acknowledgment loss");
      return result;
    });
    await f.store.markProposalShown(older.id, older.revision);
    expect(f.store.exportProposalAuthority().acceptedAllocations).toEqual(accepted);
    const result = await f.store.publishScheduleRange(await f.command());
    expect(result).toMatchObject({
      reason:
        fault === "knownAbort" ? "acceptedAllocationUnrealized" : "publicationSourceUnqualified",
    });
    expect(f.counts().transactions).toBe(0);
    const model = await f.store.queryPlanningReview(f.query);
    expect(model.acceptedLiabilities.records).toHaveLength(3);
    expect(model.acceptedLiabilities.coverage.status).toBe(
      fault === "knownAbort" ? "complete" : "partial",
    );
  },
);
it("qualified out-of-range claims do not block; protected whole authority cannot infer irrelevance", async () => {
  const f = await publicationFixture(),
    mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementation((rows, admit, observe) =>
    mutate(
      rows,
      rows.some((row) => row.store === "realizationAuthority") ? () => false : admit,
      observe,
    ),
  );
  await f.store.acceptProposalOption(f.input);
  f.store.generatePreview({
    rangeStartDate: "2026-09-18",
    rangeEndDate: "2026-09-18",
    planningWindowStart: new Date(2026, 8, 18, 0),
    planningWindowEnd: new Date(2026, 8, 19, 0),
    generatedAt: "2026-09-16T12:00:00.000Z",
  });
  const { createReviewScope, publicationRangeFromReviewScope } =
    await import("../core/planning/reviewScope.js");
  const scope = createReviewScope({
    kind: "day",
    anchorUserDayDate: "2026-09-18",
    weekStartsOn: "monday",
  });
  const query = { reviewScope: scope, historyAsOf: "2026-09-16T12:00:00.000Z" };
  const model = await f.store.queryPlanningReview(query);
  expect(model.acceptedLiabilities.records).toEqual([]);
  expect(publicationBlockers(model)).toEqual([]);
  const command = {
    publicationRange: publicationRangeFromReviewScope(scope),
    expectedSourceFingerprint: model.sourceFingerprint,
    publishedAt: query.historyAsOf,
  };
  expect((await f.store.publishScheduleRange(command)).status).toBe("published");
  const raw = await f.durable.getAll("historicalPlanDays"),
    older = f.store.listActionableProposals()[0]!;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    const result = await mutate(rows, admit, observe);
    if (rows.some((row) => row.store === "proposalAuthority"))
      throw Error("controlled acknowledgment loss");
    return result;
  });
  await f.store.markProposalShown(older.id, older.revision);
  expect(await f.store.publishScheduleRange(command)).toMatchObject({
    reason: "publicationSourceUnqualified",
  });
  expect(f.counts().transactions).toBe(1);
  expect(await f.durable.getAll("historicalPlanDays")).toEqual(raw);
});
it("Goal runtime accepted-pending remains qualified and dry/actual materialization uses identical metadata", async () => {
  const f = await publicationFixture();
  await f.store.acceptProposalOption(f.input);
  f.generate();
  const entered = deferred(),
    release = deferred(),
    mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((row) => row.store === "goals")) {
      entered.resolve();
      await release.promise;
    }
    return mutate(rows, admit, observe);
  });
  const goal = f.store.listGoals()[0]!,
    update = f.store.updateGoal(goal.id, goal.revision, { title: "Pending title" });
  await entered.promise;
  const model = await f.store.queryPlanningReview(f.query);
  expect(model.sourceQualification.goal).toMatchObject({
    status: "qualified",
    basis: "currentRuntime",
    lastWrite: "runtimeAcceptedPending",
  });
  expect(model.publication.materialization.status).toBe("eligible");
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const history = await f.store.exportHistoricalPlan();
  expect(JSON.stringify(history)).toContain("Pending title");
  release.resolve();
  await update;
});
it("same-reason protection notifications advance observation synchronously even with equal Goal arrays", async () => {
  const { createGoalSurface } = await import("./goalSurface.js"),
    db = createDayFrameDurableDb();
  vi.spyOn(db, "getAll").mockResolvedValue({
    status: "failure",
    error: { code: "readFailed", operation: "fixture" },
  });
  const goal = createGoalSurface({ storage: db }),
    observation = goal.getGoalReviewObservation(),
    seen: object[] = [];
  observation.subscribe(() => seen.push(observation.token()));
  await goal.initializeGoals();
  await goal.initializeGoals();
  expect(seen).toHaveLength(2);
  expect(seen[0]).not.toBe(seen[1]);
  expect(goal.listGoals()).toEqual([]);
  expect(goal.getGoalIngressStatus()).toMatchObject({ status: "protected", reason: "readFailure" });
});
it("a known missing Goal retains lawful fallback rather than protected-source absence", async () => {
  const f = await publicationFixture();
  await f.store.acceptProposalOption(f.input);
  f.generate();
  const controller = getDayFrameRuntimeAuthorityController(f.store, capability),
    snapshot = controller.captureAll().goals as object;
  expect(controller.begin().status).toBe("begun");
  expect(
    controller.install("goals", {
      ...snapshot,
      authority: { version: 1, goals: [] },
      desired: { version: 1, goals: [] },
    }).status,
  ).toBe("installed");
  controller.commit();
  const model = await f.store.queryPlanningReview(f.query);
  expect(model.sourceQualification.goal.status).toBe("qualified");
  expect(model.publication.materialization.status).toBe("eligible");
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
});
it("healthy to protected to healthy with equal Goal authority invalidates the old private witness", async () => {
  const f = await publicationFixture(),
    before = await f.store.queryPlanningReview(f.query),
    read = f.durable.getAll;
  vi.spyOn(f.durable, "getAll").mockImplementationOnce(async () => ({
    status: "failure",
    error: { code: "readFailed", operation: "controlledGoalRead" },
  }));
  expect((await f.store.initializeGoals()).status).toBe("protected");
  expect(checkReviewSources(before)).toMatchObject({ reason: "publicationSourceUnqualified" });
  vi.spyOn(f.durable, "getAll").mockImplementation(read);
  await f.store.initializeGoals();
  expect(checkReviewSources(before)).toMatchObject({ reason: "sourceChanged" });
  expect((await f.store.queryPlanningReview(f.query)).sourceFingerprint).toBe(
    before.sourceFingerprint,
  );
});
it.each([
  [{ status: "noSource", reason: "missing" }, "qualified"],
  [{ status: "noSource", reason: "resolvedByAbandonment" }, "qualified"],
  [{ status: "noSource", reason: "storageUnavailable" }, "readUnavailable"],
  [{ status: "recoveryRequired", reason: "invalidEnvelope" }, "protected"],
  [{ status: "initializing" }, "initializing"],
] as const)("Active setup mapping preserves %s", (ingress, expected) => {
  const value = runtimeQualification("activeSetup", ingress);
  expect(value.status === "qualified" ? value.status : value.issue.reason).toBe(expected);
});
it("required-source qualification precedes own history protection while global readiness retains precedence", async () => {
  const f = await publicationFixture(),
    before = await f.command(),
    controller = getDayFrameRuntimeAuthorityController(f.store, capability),
    snapshots = controller.captureAll();
  expect(controller.begin().status).toBe("begun");
  controller.install("proposals", {
    ...(snapshots.proposals as object),
    ingress: { status: "protected", reason: "readFailure" },
    durability: "storageFailure",
  });
  controller.install("historicalPlan", {
    ...(snapshots.historicalPlan as object),
    status: { status: "protected", reason: "physicalMismatch" },
  });
  controller.commit();
  expect(await f.store.publishScheduleRange(before)).toMatchObject({
    reason: "publicationSourceUnqualified",
    sourceIssues: expect.arrayContaining([
      expect.objectContaining({ source: "proposal", reason: "protected" }),
    ]),
  });
  expect(f.counts().transactions).toBe(0);
});
