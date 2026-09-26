import { expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { omissionFixture, at } from "./omissionPublicationTestFixtures.js";
import { createDayFrameStore } from "./dayFrameStore.js";
import { materializeHistoricalExecutionTarget } from "../core/execution/historicalExecutionTarget.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import { checkReviewSources } from "./reviewSourceQualification.js";
import { materializePlanPublication } from "../core/historicalPlan/materializePlanPublication.js";
import type { DayFramePreview } from "./types.js";

async function omitted(pendingProposal = false) {
  const f = await omissionFixture(pendingProposal);
  f.addConflict();
  const accepted = f.accept();
  return { ...f, ...accepted };
}
async function backup(store: ReturnType<typeof createDayFrameStore>) {
  const result = await store.exportBackupV14(at);
  if (result.status !== "exported") throw Error(JSON.stringify(result));
  return result.backup;
}

it("publishes the real accepted omission exactly once without occupancy or execution inference", async () => {
  const f = await omissionFixture();
  const healthy = await f.materialize();
  expect(healthy.result.status).toBe("materialized");
  expect(healthy.snapshot.state.preview!.result).not.toHaveProperty("omissionEvidence");
  const realized = f.store.exportRealizationAuthority();
  const allocations = f.store.exportProposalAuthority();
  f.addConflict();
  const { original, decision } = f.accept();
  const preview = f.store.getState().preview!;
  expect(preview.isStale).toBe(false);
  expect(preview.revisedAt).toBeUndefined();
  expect(preview.result.blockCandidates.some((x) => x.templateId === "routine")).toBe(false);
  expect(preview.result.scheduledBlocks.some((x) => x.templateId === "routine")).toBe(false);
  expect(preview.result.unplacedCandidates.some((x) => x.templateId === "routine")).toBe(false);
  expect(preview.result.frictionPoints).toHaveLength(0);
  expect(preview.result.omissionEvidence!.occurrences).toHaveLength(1);
  expect(preview.result.omissionEvidence!.occurrences[0]).toMatchObject({
    decisionId: decision.id,
    target: decision.target,
    title: "Routine",
    userDayDate: "2026-09-17",
  });
  expect(original.result.unplacedCandidates.find((x) => x.templateId === "routine")).toBeDefined();
  const before = await backup(f.store),
    writes = vi.spyOn(localStorage, "setItem"),
    mutate = vi.mocked(f.durable.mutate),
    calls = mutate.mock.calls.length;
  const read = await f.materialize();
  expect(read.review.queryState).toBe("current");
  expect(read.review.publication.materialization.status).toBe("eligible");
  expect(read.result.status).toBe("materialized");
  expect(f.counts()).toEqual({ attempts: 0, transactions: 0 });
  expect(mutate.mock.calls).toHaveLength(calls);
  expect(writes).not.toHaveBeenCalled();
  expect((await backup(f.store)).data).toEqual(before.data);
  const result = await f.store.publishScheduleRange(await f.command());
  expect(result.status).toBe("published");
  expect(f.counts()).toEqual({ attempts: 1, transactions: 1 });
  const stored = await f.history.exportHistoricalPlan();
  if (stored.status !== "exported") throw Error(stored.status);
  expect(stored.batches).toHaveLength(1);
  const entries = stored.batches[0]!.days[0]!.occurrences;
  const omission = entries.filter((x) => x.plan.state === "omitted");
  expect(omission).toHaveLength(1);
  expect(omission[0]).toMatchObject({
    reference: decision.target,
    title: "Routine",
    plan: { state: "omitted" },
    timing: { kind: "timed" },
  });
  expect(Object.keys(omission[0]!.plan)).toEqual(["state"]);
  expect(entries.filter((x) => x.version === 3)).toHaveLength(3);
  expect(entries.filter((x) => x.version === 4)).toHaveLength(1);
  expect(f.store.exportRealizationAuthority()).toEqual(realized);
  expect(f.store.exportProposalAuthority()).toEqual(allocations);
  expect(f.store.getExecutionHistory()).toHaveLength(0);
  expect(f.store.exportProgressObservationAuthority().observations).toHaveLength(0);
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("alreadyPublished");
  expect(f.counts().transactions).toBe(1);
  expect(await f.history.exportHistoricalPlan()).toEqual(stored);
});

it("Try and discarded Try remain provisional and cannot publish an omission", async () => {
  const f = await omissionFixture();
  f.addConflict();
  f.trial();
  expect(f.store.getPlanDecisions()).toHaveLength(0);
  expect(await f.store.publishScheduleRange(await f.command())).toMatchObject({
    status: "rejected",
    reason: "tryPreview",
  });
  f.generate();
  expect(f.store.getState().preview!.result.omissionEvidence).toBeUndefined();
  expect(f.store.getState().preview!.result.frictionPoints.length).toBeGreaterThan(0);
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("rejected");
  expect(f.counts()).toEqual({ attempts: 0, transactions: 0 });
});

it.each([
  "missing",
  "stale",
  "try",
  "generation",
  "window",
  "decision",
  "target",
  "ownerDay",
  "identity",
  "unsupported",
  "duplicate",
] as const)(
  "refuses %s omission context without constructing historical authority",
  async (kind) => {
    const f = await omitted(),
      preview = structuredClone(f.store.getState().preview!);
    const evidence = preview.result.omissionEvidence!,
      entry = evidence.occurrences[0]!;
    if (kind === "missing") delete preview.result.omissionEvidence;
    if (kind === "stale") preview.isStale = true;
    if (kind === "try") preview.revisedAt = at;
    if (kind === "generation") preview.generatedAt = "2026-09-16T13:00:00.000Z";
    if (kind === "window") preview.planningWindowEnd = new Date(2026, 8, 19);
    if (kind === "decision")
      preview.result.omissionEvidence = {
        ...evidence,
        occurrences: [{ ...entry, decisionId: crypto.randomUUID() as typeof entry.decisionId }],
      };
    if (kind === "target" && entry.target.sourceKind === "template")
      preview.result.omissionEvidence = {
        ...evidence,
        occurrences: [
          {
            ...entry,
            target: {
              ...entry.target,
              template: {
                ...entry.target.template,
                incarnationId: crypto.randomUUID() as typeof entry.target.template.incarnationId,
              },
            },
          },
        ],
      };
    if (kind === "ownerDay")
      preview.result.omissionEvidence = {
        ...evidence,
        occurrences: [{ ...entry, userDayDate: "2026-09-18" }],
      };
    if (kind === "identity" && entry.occurrenceIdentity.sourceKind === "template")
      preview.result.omissionEvidence = {
        ...evidence,
        occurrences: [
          { ...entry, occurrenceIdentity: { ...entry.occurrenceIdentity, templateId: "other" } },
        ],
      };
    if (kind === "unsupported")
      preview.result.omissionEvidence = {
        ...evidence,
        occurrences: [
          {
            ...entry,
            occurrenceIdentity: {
              version: 1,
              sourceKind: "manualEvent",
              manualEventId: "appointment",
            },
          },
        ],
      };
    if (kind === "duplicate")
      preview.result.omissionEvidence = { ...evidence, occurrences: [entry, entry] };
    const result = materializeHistoricalExecutionTarget({
      authoredSetup: f.store.getState(),
      preview,
      selection: { kind: "planDecision", decisionId: f.decision.id },
    });
    expect(result.status).toBe(
      kind === "stale"
        ? "stalePreview"
        : kind === "try"
          ? "tryOnlyPreview"
          : "insufficientHistoricalContext",
    );
    expect(f.counts()).toEqual({ attempts: 0, transactions: 0 });
  },
);

it("does not retarget a deleted or recreated source or a removed recurrence", async () => {
  const f = await omitted(),
    old = f.store.getState(),
    preview = old.preview!;
  const target = () =>
    materializeHistoricalExecutionTarget({
      authoredSetup: f.store.getState(),
      preview,
      selection: { kind: "planDecision", decisionId: f.decision.id },
    });
  f.store.setBlockRecurrences([]);
  expect(target().status).toBe("sourceMissing");
  f.store.setBlockTemplates([]);
  expect(target().status).toBe("sourceMissing");
  f.store.setBlockTemplates(old.blockTemplates);
  f.store.setBlockRecurrences(old.blockRecurrences);
  expect(target().status).toBe("lifetimeMismatch");
  f.generate();
  expect(f.store.getState().preview!.result.omissionEvidence).toBeUndefined();
  expect(
    f.store
      .getState()
      .preview!.result.planDecisionResults.some(
        (r) => r.kind === "omitOccurrence" && r.status === "applied",
      ),
  ).toBe(false);
  expect(f.counts().transactions).toBe(0);
});

it("keeps exact daily omission and owner-day scope across overlapping non-midnight generation", async () => {
  const f = await omissionFixture();
  f.store.setSchedulingPreferences({ dayBoundaryStartTime: "03:00", weekStartsOn: "monday" });
  f.addConflict();
  const { decision } = f.accept();
  function generate(start: "2026-09-16" | "2026-09-17", end: "2026-09-18" | "2026-09-19") {
    f.store.generatePreview({
      rangeStartDate: start,
      rangeEndDate: end,
      planningWindowStart: new Date(`${start}T03:00:00`),
      planningWindowEnd: new Date(`2026-09-${Number(end.slice(-2)) + 1}T03:00:00`),
      generatedAt: at,
    });
  }
  generate("2026-09-16", "2026-09-18");
  const first = f.store.getState().preview!;
  generate("2026-09-17", "2026-09-19");
  const second = f.store.getState().preview!;
  const target = (preview: DayFramePreview) =>
    materializeHistoricalExecutionTarget({
      authoredSetup: f.store.getState(),
      preview,
      selection: { kind: "planDecision", decisionId: decision.id },
    });
  const one = target(first),
    two = target(second);
  expect(one).toEqual(two);
  expect(two).toMatchObject({
    status: "materialized",
    target: {
      reference: decision.target,
      snapshot: {
        userDay: { date: "2026-09-17", dayBoundaryStartTime: "03:00" },
        plan: { state: "omitted" },
      },
    },
  });
  expect(
    second.result.scheduledBlocks
      .filter((x) => x.templateId === "routine")
      .map((x) => x.userDayDate),
  ).toEqual(["2026-09-18", "2026-09-19"]);
  const query = {
    reviewScope: createReviewScope({
      kind: "day",
      anchorUserDayDate: "2026-09-18",
      weekStartsOn: "monday",
    }),
    historyAsOf: at,
  };
  const { getReviewSources } = await import("./reviewSourceQualification.js");
  const review = await f.store.queryPlanningReview(query),
    snapshot = getReviewSources(review)!;
  const materialized = materializePlanPublication({
    authoredSetup: snapshot.setup,
    preview: snapshot.state.preview,
    sleepAuthority: snapshot.sleep,
    goals: snapshot.goals,
    publicationRange: {
      version: 1,
      scopeType: "publicationRange",
      startUserDayDate: "2026-09-18",
      endUserDayDateExclusive: "2026-09-19",
      provenance: { source: "explicitPublication" },
    },
    providers: { now: () => at },
  });
  expect(materialized.status).toBe("materialized");
  if (materialized.status !== "materialized") throw Error(JSON.stringify(materialized));
  expect(
    materialized.batch.days.flatMap((d) => d.occurrences).filter((o) => o.plan.state === "omitted"),
  ).toHaveLength(0);
});

it("removal invalidates the old Review and only changes future generation, preserving published omission", async () => {
  const f = await omitted();
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const history = await f.history.exportHistoricalPlan(),
    old = await f.store.queryPlanningReview(f.query),
    command = await f.command();
  expect(f.store.removePlanDecision(f.decision.id).status).toBe("removed");
  expect(checkReviewSources(old).status).toBe("rejected");
  expect((await f.store.publishScheduleRange(command)).status).toBe("rejected");
  f.generate();
  expect(f.store.getState().preview!.result.omissionEvidence).toBeUndefined();
  expect(
    f.store.getState().preview!.result.unplacedCandidates.some((x) => x.templateId === "routine"),
  ).toBe(true);
  expect(await f.history.exportHistoricalPlan()).toEqual(history);
  f.store.setManualEvents([]);
  f.store.setBlockTemplates(
    f.store.getState().blockTemplates.map((t) => ({
      ...t,
      customWindowStartTime: "16:00",
      customWindowEndTime: "19:00",
    })),
  );
  f.generate();
  expect(f.store.getState().preview!.result.frictionPoints).toEqual([]);
  const next = await f.command();
  next.publishedAt = "2026-09-16T12:01:00.000Z";
  next.expectedSourceFingerprint = (
    await f.store.queryPlanningReview({ ...f.query, historyAsOf: next.publishedAt })
  ).sourceFingerprint;
  const published = await f.store.publishScheduleRange(next);
  expect(published, JSON.stringify(published)).toMatchObject({ status: "published" });
  const current = await f.history.exportHistoricalPlan();
  if (current.status !== "exported" || history.status !== "exported") throw Error("history");
  expect(current.batches[0]).toEqual(history.batches[0]);
  expect(
    current.batches[1]!.days[0]!.occurrences.find((o) => o.reference.sourceKind === "template")!
      .plan.state,
  ).toBe("scheduled");
});

it("round-trips omission and nonempty realized authority through actual V14 and fresh reload", async () => {
  const f = await omitted();
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const source = await backup(f.store);
  localStorage.clear();
  vi.stubGlobal("indexedDB", new IDBFactory());
  const destination = createDayFrameStore();
  await destination.whenReady();
  expect((await destination.createGoal({ title: "Distinct destination" })).status).toBe("accepted");
  expect((await destination.importBackupFile(source)).status).toBe("restoredV14");
  expect((await backup(destination)).data).toEqual(source.data);
  expect(destination.getState().preview).toBeNull();
  const reloaded = createDayFrameStore();
  await reloaded.whenReady();
  expect(reloaded.getState().preview).toBeNull();
  const restored = await backup(reloaded);
  // V14 identity-keyed top-level collections use the existing restore comparator;
  // every nested field, order, optional absence and historical record stays exact.
  const sorted = (input: typeof source.data) => {
    const data = structuredClone(input);
    for (const key of ["proposals", "candidates", "decisions", "acceptedAllocations"] as const)
      data.proposals[key].sort((a, b) => a.id.localeCompare(b.id));
    for (const key of ["realizations", "facts"] as const)
      data.realizations[key].sort((a, b) => a.id.localeCompare(b.id));
    return data;
  };
  expect(sorted(restored.data)).toEqual(sorted(source.data));
  reloaded.generatePreview({
    rangeStartDate: "2026-09-17",
    rangeEndDate: "2026-09-17",
    planningWindowStart: new Date(2026, 8, 17),
    planningWindowEnd: new Date(2026, 8, 18),
    generatedAt: at,
  });
  const review = await reloaded.queryPlanningReview(f.query);
  expect(review.publication.materialization.status).toBe("eligible");
  expect(
    await reloaded.publishScheduleRange({
      ...(await f.command()),
      expectedSourceFingerprint: review.sourceFingerprint,
    }),
  ).toMatchObject({ status: "alreadyPublished" });
  expect((await backup(reloaded)).data.historicalPlan).toEqual(source.data.historicalPlan);
});

it.each(["authored", "decision", "qualification"] as const)(
  "keeps the %s physical admission guard on omitted publication",
  async (change) => {
    const { deferred } = await import("./acceptanceLifecycleTestFixtures.js");
    const f = await omitted(change === "qualification"),
      command = await f.command(),
      entered = deferred(),
      release = deferred(),
      proposalEntered = deferred(),
      proposalRelease = deferred();
    const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
    vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      if (rows.some((r) => r.store === "historicalPlanBatches")) {
        entered.resolve();
        await release.promise;
      }
      if (rows.some((r) => r.store === "proposalAuthority")) {
        proposalEntered.resolve();
        await proposalRelease.promise;
      }
      return mutate(rows, admit, observe);
    });
    const publication = f.store.publishScheduleRange(command);
    await Promise.race([
      entered.promise,
      publication.then((r) => {
        throw Error("Publication never reached admission: " + JSON.stringify(r));
      }),
    ]);
    let pending: Promise<unknown> | undefined;
    if (change === "authored")
      f.store.setBlockTemplates(
        f.store.getState().blockTemplates.map((t) => ({ ...t, title: "Changed after review" })),
      );
    if (change === "decision") f.store.removePlanDecision(f.decision.id);
    if (change === "qualification") {
      vi.setSystemTime(new Date("2026-09-16T12:00:02.000Z"));
      pending = f.store.recordProposal(f.pendingResult!);
      await Promise.race([
        proposalEntered.promise,
        pending.then((r) => {
          throw Error("Proposal never reached mutation: " + JSON.stringify(r));
        }),
      ]);
    }
    release.resolve();
    const result = await publication;
    expect(result).toMatchObject({
      status: "rejected",
      reason: change === "qualification" ? "publicationSourceUnqualified" : "sourceChanged",
    });
    if (change === "qualification")
      expect(result).toMatchObject({
        sourceIssues: expect.arrayContaining([
          expect.objectContaining({ source: "proposal", reason: "writeInProgress" }),
        ]),
      });
    expect(f.counts()).toEqual({ attempts: 1, transactions: 0 });
    proposalRelease.resolve();
    await pending;
    expect(await f.durable.getAll("historicalPlanBatches")).toMatchObject({
      status: "success",
      value: [],
    });
  },
);

it("isolates ephemeral context and replaces an omission with the existing exact-target decision precedence", async () => {
  const f = await omitted(),
    snapshot = f.store.getState(),
    entry = snapshot.preview!.result.omissionEvidence!.occurrences[0]!;
  const detached = structuredClone(entry);
  Object.assign(entry, { title: "mutated external clone" });
  expect(f.store.getState().preview!.result.omissionEvidence!.occurrences[0]).toEqual(detached);
  const replaced = f.store.acceptPlanDecision({
    kind: "setOccurrenceDuration",
    target: f.decision.target,
    payload: { durationMinutes: 30 },
    provenance: { source: "user" },
  });
  expect(replaced.status).toBe("accepted");
  f.generate();
  expect(f.store.getPlanDecisions()).toHaveLength(1);
  expect(f.store.getPlanDecisions()[0]!.kind).toBe("setOccurrenceDuration");
  expect(f.store.getState().preview!.result.omissionEvidence).toBeUndefined();
  expect(
    f.store.getState().preview!.result.blockCandidates.find((c) => c.templateId === "routine")!
      .durationMinutes,
  ).toBe(30);
  expect(f.counts().transactions).toBe(0);
});

it("preserves an earlier scheduled snapshot with reported Actual and independent Progress when later publishing omission", async () => {
  const f = await omissionFixture();
  const templates = f.store.getState().blockTemplates;
  f.store.setBlockTemplates(
    templates.map((t) => ({ ...t, customWindowStartTime: "16:00", customWindowEndTime: "19:00" })),
  );
  f.generate();
  expect(f.store.getState().preview!.result.omissionEvidence).toBeUndefined();
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const healthy = await f.history.exportHistoricalPlan();
  if (healthy.status !== "exported") throw Error(healthy.status);
  const day = healthy.batches[0]!.days[0]!,
    occurrence = day.occurrences.find((o) => o.reference.sourceKind === "template")!;
  const { materializeHistoricalPlanExecutionTarget } =
    await import("../core/execution/historicalPlanExecutionTarget.js");
  const target = materializeHistoricalPlanExecutionTarget({ day, occurrence });
  if (target.status !== "materialized") throw Error(target.status);
  expect(target.target.snapshot.plan.state).toBe("scheduled");
  expect(
    f.store.recordExecution({
      subject: { kind: "planned", reference: target.target.reference },
      snapshot: target.target.snapshot,
      outcome: "completed",
      actualTime: { durationMinutes: 20 },
    }).status,
  ).toBe("accepted");
  await f.store.retryExecutionHistoryPersistence();
  const goal = await f.store.createGoal({ title: "Independent pages" });
  if (goal.status !== "accepted") throw Error(goal.status);
  const definition = await f.store.createMeasurementDefinition(
    goal.goal.id,
    { id: "manualQuantityTarget", version: 1 },
    { targetValue: "100", unitId: "pages" },
  );
  if (definition.status !== "accepted") throw Error(definition.status);
  expect(
    (
      await f.store.createProgressObservation({
        goalId: goal.goal.id,
        observedAt: definition.definition.effectiveFrom,
        value: "12",
        expectedDefinitionRevision: 1,
      })
    ).status,
  ).toBe("accepted");
  const actual = f.store.getExecutionHistory(),
    progress = f.store.exportProgressObservationAuthority();
  f.store.setBlockTemplates(templates);
  f.addConflict();
  f.accept();
  const command = await f.command();
  command.publishedAt = "2026-09-16T12:02:00.000Z";
  command.expectedSourceFingerprint = (
    await f.store.queryPlanningReview({ ...f.query, historyAsOf: command.publishedAt })
  ).sourceFingerprint;
  expect((await f.store.publishScheduleRange(command)).status).toBe("published");
  const stored = await f.history.exportHistoricalPlan();
  if (stored.status !== "exported") throw Error(stored.status);
  expect(stored.batches).toHaveLength(2);
  expect(stored.batches[0]).toEqual(healthy.batches[0]);
  expect(f.store.getExecutionHistory()).toEqual(actual);
  expect(f.store.exportProgressObservationAuthority()).toEqual(progress);
  const latest = stored.batches[1]!;
  expect(latest.days[0]!.occurrences.filter((o) => o.plan.state === "omitted")).toHaveLength(1);
  const { projectHistoricalCompletionDistributionV1, HISTORICAL_METRIC_POLICY_V1 } =
    await import("../core/historicalIntelligence/completionDistribution.js");
  const report = projectHistoricalCompletionDistributionV1({
    query: {
      policy: HISTORICAL_METRIC_POLICY_V1,
      startUserDayDate: "2026-09-17",
      endUserDayDate: "2026-09-17",
      evaluationAsOf: "2026-09-18T12:00:00.000Z",
    },
    days: latest.days.map((day) => ({ batchId: latest.id, publishedAt: latest.publishedAt, day })),
    executionRecords: actual,
    missingUserDayDates: [],
  });
  expect(report).toMatchObject({
    status: "projected",
    distribution: { skipped: 0 },
    provenance: {
      excluded: expect.arrayContaining([expect.objectContaining({ reason: "excludedOmitted" })]),
    },
  });
});
