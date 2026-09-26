import { DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY as capability } from "./dayFrameRuntimeAuthority.js";
import { expect, it, vi } from "vitest";
import { publicationFixture } from "./publicationSourceTestFixtures.js";
import { deferred } from "./acceptanceLifecycleTestFixtures.js";
import { checkReviewSources } from "./reviewSourceQualification.js";

it.each(["active", "settledAbort", "lostAck"] as const)(
  "physical admission retains %s Proposal write evidence and creates zero history transactions",
  async (phase) => {
    const f = await publicationFixture(),
      command = await f.command(),
      historyEntered = deferred(),
      historyRelease = deferred(),
      proposalEntered = deferred(),
      proposalRelease = deferred();
    const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
    vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      const history = rows.some((row) => row.store === "historicalPlanBatches"),
        proposal = rows.some((row) => row.store === "proposalAuthority");
      if (history) {
        historyEntered.resolve();
        await historyRelease.promise;
      }
      if (proposal) {
        proposalEntered.resolve();
        await proposalRelease.promise;
      }
      const result = await mutate(
        proposal && phase === "settledAbort"
          ? [
              ...rows,
              { type: "put", store: "proposalAuthority", value: { invalid: "missing key" } },
            ]
          : rows,
        admit,
        observe,
      );
      if (proposal && phase === "lostAck")
        throw Error("controlled acknowledgment loss after native commit");
      return result;
    });
    const publication = f.store.publishScheduleRange(command);
    await historyEntered.promise;
    const write = f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
    await proposalEntered.promise;
    if (phase !== "active") {
      proposalRelease.resolve();
      await write;
    }
    historyRelease.resolve();
    const result = await publication;
    if (phase === "settledAbort") expect(result).toMatchObject({ reason: "sourceChanged" });
    else
      expect(result).toMatchObject({
        reason: "publicationSourceUnqualified",
        sourceIssues: expect.arrayContaining([
          expect.objectContaining({
            source: "proposal",
            reason: phase === "active" ? "writeInProgress" : "commitUnconfirmed",
          }),
        ]),
      });
    expect(f.counts()).toEqual({ attempts: 1, transactions: 0 });
    proposalRelease.resolve();
    await write;
    if (phase === "settledAbort")
      expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  },
);
it("Boolean denial is latched even if its source settles before adapter failure delivery", async () => {
  const f = await publicationFixture(),
    command = await f.command(),
    entered = deferred(),
    release = deferred(),
    proposalEntered = deferred(),
    proposalRelease = deferred();
  const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((row) => row.store === "proposalAuthority")) {
      proposalEntered.resolve();
      await proposalRelease.promise;
      return mutate(rows, admit, observe);
    }
    if (rows.some((row) => row.store === "historicalPlanBatches")) {
      entered.resolve();
      await release.promise;
      const result = await mutate(rows, admit, observe); // real adapter invokes final admission, creates no transaction
      proposalRelease.resolve();
      await proposal; // healthy again before returning the admission denial
      return result;
    }
    return mutate(rows, admit, observe);
  });
  const publication = f.store.publishScheduleRange(command);
  await entered.promise;
  const proposal = f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
  await proposalEntered.promise;
  release.resolve();
  expect(await publication).toMatchObject({
    reason: "publicationSourceUnqualified",
    sourceIssues: expect.arrayContaining([
      expect.objectContaining({ source: "proposal", reason: "writeInProgress" }),
    ]),
  });
  expect(f.store.getProposalIngressStatus().status).toBe("accepted");
  expect(f.counts().transactions).toBe(0);
});
it.each(["healthyChange", "protected", "verificationFailure"] as const)(
  "post-admission %s preserves physical truth and original receipt",
  async (phase) => {
    const f = await publicationFixture(),
      command = await f.command(),
      admitted = deferred(),
      release = deferred();
    const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!,
      get = f.durable.get;
    let physical = false;
    vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
      const result = await mutate(rows, admit, (receipt) => {
        observe?.(receipt);
        if (rows.some((row) => row.store === "historicalPlanBatches")) physical = true;
      });
      if (rows.some((row) => row.store === "proposalAuthority") && phase !== "healthyChange")
        throw Error("controlled Proposal acknowledgment loss");
      return result;
    });
    vi.spyOn(f.durable, "get").mockImplementation(async (store, key) => {
      if (store === "historicalPlanBatches" && physical) {
        admitted.resolve();
        await release.promise;
        if (phase === "verificationFailure")
          return {
            status: "failure",
            error: { code: "readFailed", operation: "controlledVerification" },
          };
      }
      return get(store, key);
    });
    const publication = f.store.publishScheduleRange(command);
    await admitted.promise;
    await f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
    release.resolve();
    const result = await publication;
    if (phase === "verificationFailure")
      expect(result).toMatchObject({ status: "rejected", reason: "verificationFailedAfterCommit" });
    else expect(result).toMatchObject({ status: "published", reviewRequired: true });
    if (phase === "protected")
      expect("sourceIssues" in result ? result.sourceIssues : undefined).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ source: "proposal", reason: "commitUnconfirmed" }),
        ]),
      );
    expect(result.receipt?.isCurrent()).toBe(true);
    expect(f.counts().transactions).toBe(1);
    const raw = await f.durable.getAll("historicalPlanBatches");
    expect(raw.status === "success" && raw.value.length).toBe(1);
  },
);
it("FIFO successor submitted after predecessor transaction starts revalidates history without blanket append invalidation", async () => {
  const f = await publicationFixture(),
    command = await f.command(),
    admitted = deferred(),
    release = deferred(),
    mutate = vi.mocked(f.durable.mutate).getMockImplementation()!,
    get = f.durable.get;
  let physical = false,
    held = false;
  vi.spyOn(f.durable, "mutate").mockImplementation((rows, admit, observe) =>
    mutate(rows, admit, (receipt) => {
      observe?.(receipt);
      if (rows.some((row) => row.store === "historicalPlanBatches")) physical = true;
    }),
  );
  vi.spyOn(f.durable, "get").mockImplementation(async (store, key) => {
    if (store === "historicalPlanBatches" && physical && !held) {
      held = true;
      admitted.resolve();
      await release.promise;
    }
    return get(store, key);
  });
  const a = f.store.publishScheduleRange(command);
  await admitted.promise;
  const reviewed = await f.store.queryPlanningReview(f.query);
  expect(reviewed.queryState).toBe("current");
  const b = f.store.publishScheduleRange({
    ...command,
    expectedSourceFingerprint: reviewed.sourceFingerprint,
  });
  release.resolve();
  expect((await a).status).toBe("published");
  expect((await b).status).toBe("alreadyPublished");
  expect(checkReviewSources(reviewed)).toEqual({ status: "current" });
  expect(f.counts().transactions).toBe(1);
});
it("ordinary append during a query invalidates its collection but cannot mix later membership into captured range", async () => {
  const f = await publicationFixture(),
    command = await f.command();
  expect((await f.store.publishScheduleRange(command)).status).toBe("published");
  const before = await f.history.exportHistoricalPlan();
  if (before.status !== "exported") throw Error(before.status);
  const entered = deferred(),
    release = deferred(),
    read = f.durable.queryIndex;
  let held = false;
  vi.spyOn(f.durable, "queryIndex").mockImplementation(async (...args) => {
    const result = await read(...args);
    if (!held && args[0].store === "historicalPlanDays") {
      held = true;
      entered.resolve();
      await release.promise;
    }
    return result;
  });
  const query = f.store.queryPlanningReview(f.query);
  await entered.promise;
  const next = structuredClone(before.batches[0]!);
  next.id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never;
  next.publishedAt = "2026-09-16T13:00:00.000Z";
  // A supported legacy append with a different day keeps captured membership immutable.
  next.range = { startUserDayDate: "2026-09-18", endUserDayDate: "2026-09-18" };
  next.days = [
    {
      version: 1,
      userDayDate: "2026-09-18",
      dayBoundaryStartTime: "00:00",
      weekStartsOn: "monday",
      utcOffsetMinutes: -300,
      occurrences: [],
    },
  ];
  expect((await f.history.publish(next)).status).toBe("publishedAndDurable");
  release.resolve();
  const result = await query;
  expect(result.queryState).toBe("sourceChanged");
  expect(result.publicationWitness.status).toBe("blocked");
});
it("fresh pending classification requires qualification, while exact legacy pending retry retains frozen bytes", async () => {
  const f = await publicationFixture(),
    review = await f.store.queryPlanningReview(f.query);
  const { getReviewSources } = await import("./reviewSourceQualification.js"),
    { materializePlanPublication } =
      await import("../core/historicalPlan/materializePlanPublication.js");
  const snapshot = getReviewSources(review)!,
    command = await f.command();
  const result = materializePlanPublication({
    authoredSetup: snapshot.setup,
    preview: snapshot.state.preview,
    goals: snapshot.goals,
    sleepAuthority: snapshot.sleep,
    publicationRange: command.publicationRange,
    providers: { now: () => command.publishedAt },
  });
  if (result.status !== "materialized") throw Error(result.status);
  const mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementationOnce((rows, _admit, observe) =>
    mutate(rows, () => false, observe),
  );
  expect((await f.history.publish(result.batch)).status).toBe("publishedPendingDurability");
  const pending = f.history.getPendingPublications();
  expect(pending).toEqual([result.batch]);
  // With qualified sources, accepted-pending remains the existing explicit failure.
  const direct = await f.history.publishAtomically(result.batch, {
    isCurrent: () => true,
    checkSources: () => checkReviewSources(review),
  });
  expect(direct.status).toBe("identicalPending");
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    const value = await mutate(rows, admit, observe);
    if (rows.some((row) => row.store === "proposalAuthority"))
      throw Error("controlled acknowledgment loss");
    return value;
  });
  await f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
  expect(await f.store.publishScheduleRange(command)).toMatchObject({
    reason: "publicationSourceUnqualified",
  });
  expect((await f.history.retryPendingPublications()).status).toBe("durable");
  const exported = await f.history.exportHistoricalPlan();
  expect(exported.status === "exported" && exported.batches).toEqual(pending);
});
it("existing-row fast path checks the original source witness after physical readback", async () => {
  const f = await publicationFixture();
  expect((await f.store.publishScheduleRange(await f.command())).status).toBe("published");
  const exported = await f.history.exportHistoricalPlan();
  if (exported.status !== "exported") throw Error(exported.status);
  const before = await f.durable.getAll("historicalPlanDays"),
    batch = exported.batches[0]!;
  // Controlled read seam: a captured empty metadata view, with an existing physical row
  // discovered only by the final get. No physical history is changed by this fixture.
  f.history.getRuntimeAuthorityAdapter(capability).installRuntimeExact({
    status: { status: "ready", pendingCount: 0 },
    pending: [],
    batchMetadata: [],
  });
  const getAll = f.durable.getAll;
  vi.spyOn(f.durable, "getAll").mockImplementation((store) =>
    store === "historicalPlanBatches"
      ? Promise.resolve({ status: "success", value: [] })
      : getAll(store),
  );
  await f.history.initialize();
  const review = await f.store.queryPlanningReview(f.query),
    query = f.durable.queryIndex,
    get = f.durable.get,
    entered = deferred(),
    release = deferred();
  let discovered = false;
  vi.spyOn(f.durable, "queryIndex").mockImplementation((input) =>
    input.store === "historicalPlanDays" && !discovered
      ? Promise.resolve({ status: "success", value: [] })
      : query(input),
  );
  vi.spyOn(f.durable, "get").mockImplementation(async (store, key) => {
    const result = await get(store, key);
    if (store === "historicalPlanBatches") {
      discovered = true;
      entered.resolve();
      await release.promise;
    }
    return result;
  });
  const publication = f.history.publishAtomically(batch, {
    isCurrent: () => true,
    checkSources: () => checkReviewSources(review),
  });
  await entered.promise;
  await f.store.markProposalShown(f.input.proposalId, f.input.proposalRevision);
  release.resolve();
  expect(await publication).toMatchObject({ status: "rejected", reason: "sourceChanged" });
  expect(f.counts().transactions).toBe(1);
  expect(await f.durable.getAll("historicalPlanDays")).toEqual(before);
});
it("a separate active realization lease is decisive at final publication admission", async () => {
  const f = await publicationFixture(),
    command = await f.command(),
    historyEntered = deferred(),
    historyRelease = deferred(),
    realizationEntered = deferred(),
    realizationRelease = deferred(),
    mutate = vi.mocked(f.durable.mutate).getMockImplementation()!;
  vi.spyOn(f.durable, "mutate").mockImplementation(async (rows, admit, observe) => {
    if (rows.some((row) => row.store === "historicalPlanBatches")) {
      historyEntered.resolve();
      await historyRelease.promise;
    }
    if (rows.some((row) => row.store === "realizationAuthority")) {
      realizationEntered.resolve();
      await realizationRelease.promise;
    }
    return mutate(rows, admit, observe);
  });
  const publication = f.store.publishScheduleRange(command);
  await historyEntered.promise;
  const acceptance = f.store.acceptProposalOption(f.input);
  await realizationEntered.promise;
  historyRelease.resolve();
  expect(await publication).toMatchObject({
    reason: "publicationSourceUnqualified",
    sourceIssues: expect.arrayContaining([
      expect.objectContaining({ source: "realization", reason: "writeInProgress" }),
    ]),
  });
  expect(f.counts().transactions).toBe(0);
  realizationRelease.resolve();
  expect((await acceptance).status).toBe("accepted");
});
